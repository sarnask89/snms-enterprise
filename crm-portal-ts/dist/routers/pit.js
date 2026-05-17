import { Router } from "express";
import { AppDataSource } from "../database.js";
import { NetNode } from "../models/network.js";
export const router = Router();
const netNodeRepo = AppDataSource.getRepository(NetNode);
function hasPuwgCoordinates(node) {
    return Number.isFinite(node.x1992) && Number.isFinite(node.y1992);
}
function escapeXml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&apos;");
}
function buildNodeGml(nodes) {
    const members = nodes.map((node) => `  <gml:featureMember>
    <snms:NetNode gml:id="net-node-${node.id}">
      <snms:id>${node.id}</snms:id>
      <snms:name>${escapeXml(node.name)}</snms:name>
      <snms:nodeType>${escapeXml(node.nodeType ?? "")}</snms:nodeType>
      <snms:locationDetail>${escapeXml(node.locationDetail ?? "")}</snms:locationDetail>
      <snms:geometry>
        <gml:Point srsName="EPSG:2180">
          <gml:pos>${node.x1992} ${node.y1992}</gml:pos>
        </gml:Point>
      </snms:geometry>
    </snms:NetNode>
  </gml:featureMember>`).join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>
<gml:FeatureCollection xmlns:gml="http://www.opengis.net/gml/3.2" xmlns:snms="https://snms.local/pit" srsName="EPSG:2180">
${members}
</gml:FeatureCollection>
`;
}
router.get("/export/nodes", async (_req, res) => {
    try {
        const nodes = await netNodeRepo.find({ order: { name: "ASC" } });
        const exportableNodes = nodes.filter((node) => hasPuwgCoordinates(node));
        const gml = buildNodeGml(exportableNodes);
        res.setHeader("Content-Type", "application/gml+xml; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=\"pit-net-nodes.gml\"");
        res.send(gml);
    }
    catch (error) {
        console.error("Error exporting PIT nodes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/sync", async (_req, res) => {
    try {
        const nodes = await netNodeRepo.find();
        const exportableNodes = nodes.filter((node) => hasPuwgCoordinates(node));
        res.json({
            synced: false,
            reason: "external_pit_service_not_configured",
            totalNodes: nodes.length,
            exportableNodes: exportableNodes.length,
            missingCoordinates: nodes.length - exportableNodes.length,
        });
    }
    catch (error) {
        console.error("Error preparing PIT sync:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
//# sourceMappingURL=pit.js.map