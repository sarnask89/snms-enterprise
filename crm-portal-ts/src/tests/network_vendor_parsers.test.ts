import assert from "node:assert/strict";
import test from "node:test";
import {
    mergeDasanDiscoveryRows,
    parseDasanMacTable,
    parseDasanOnuInfo,
    parseDasanOnuStatus,
} from "../services/dasan_ssh.js";

test("parseDasanOnuStatus extracts onu rows", () => {
    const output = `
-----------------------------------------------------------------------------
    OLT    | ONU |  ACTIVE  |     Fail Reason      | Profile Name
-----------------------------------------------------------------------------
         1 |   1 |   Active |              Success | H660GM
         1 |   2 | Inactive |                    - | H660GM
         1 |   5 | Inactive |                    - | HL-1GE
`;

    const rows = parseDasanOnuStatus(output);
    assert.equal(rows.length, 3);
    assert.deepEqual(rows[0], {
        olt: 1,
        onu: 1,
        status: "active",
        failReason: "Success",
        profileName: "H660GM",
    });
    assert.deepEqual(rows[2], {
        olt: 1,
        onu: 5,
        status: "inactive",
        failReason: null,
        profileName: "HL-1GE",
    });
});

test("parseDasanOnuInfo extracts serial and optical data", () => {
    const output = `
----------------------------------------------------------------------------------
    OLT    | ONU |  STATUS  |  Serial No.  | Distance |  Rx Power  |    Profile
----------------------------------------------------------------------------------
         1 |   1 |   Active | DSNW276d9298 |    204m  | - 20.3 dBm | H660GM
         1 |   2 | Inactive | DSNW2750c2e0 |      0m  | -          | H660GM
         1 |   3 | Inactive | DSNW276dd220 |      0m  | -          | H660GM
`;

    const rows = parseDasanOnuInfo(output);
    assert.equal(rows.length, 3);
    assert.deepEqual(rows[0], {
        olt: 1,
        onu: 1,
        status: "active",
        serialNumber: "DSNW276d9298",
        distanceMeters: 204,
        rxPowerDbm: -20.3,
        profileName: "H660GM",
    });
    assert.equal(rows[1]?.distanceMeters, 0);
    assert.equal(rows[1]?.rxPowerDbm, null);
});

test("parseDasanMacTable extracts vlan, port and mac", () => {
    const output = `
================================================================================
 vid   port          mac addr          permission     status      in use
================================================================================
   99  eth15    4c:5e:0c:35:c6:7c     OK         dynamic       202.26
  100  eth01    d0:96:fb:63:f7:e1     OK         dynamic         4.40
  100  eth01    54:db:a2:18:ce:99     OK         dynamic         6.28
`;

    const rows = parseDasanMacTable(output);
    assert.equal(rows.length, 3);
    assert.deepEqual(rows[0], {
        vlanId: 99,
        portName: "eth15",
        macAddress: "4c:5e:0c:35:c6:7c",
        status: "dynamic",
        inUse: "202.26",
    });
    assert.equal(rows[2]?.portName, "eth01");
    assert.equal(rows[2]?.macAddress, "54:db:a2:18:ce:99");
});

test("mergeDasanDiscoveryRows combines status/info and preserves mac observations", () => {
    const merged = mergeDasanDiscoveryRows(
        parseDasanOnuStatus(`
-----------------------------------------------------------------------------
    OLT    | ONU |  ACTIVE  |     Fail Reason      | Profile Name
-----------------------------------------------------------------------------
         1 |   1 |   Active |              Success | H660GM
         1 |   2 | Inactive |                    - | H660GM
`),
        parseDasanOnuInfo(`
----------------------------------------------------------------------------------
    OLT    | ONU |  STATUS  |  Serial No.  | Distance |  Rx Power  |    Profile
----------------------------------------------------------------------------------
         1 |   1 |   Active | DSNW276d9298 |    204m  | - 20.3 dBm | H660GM
         1 |   2 | Inactive | DSNW2750c2e0 |      0m  | -          | H660GM
`),
        parseDasanMacTable(`
================================================================================
 vid   port          mac addr          permission     status      in use
================================================================================
  100  eth01    54:db:a2:18:ce:99     OK         dynamic         6.28
`)
    );

    assert.equal(merged.onuRows.length, 2);
    assert.equal(merged.macRows.length, 1);
    assert.deepEqual(merged.onuRows[0], {
        olt: 1,
        onu: 1,
        status: "active",
        failReason: "Success",
        profileName: "H660GM",
        serialNumber: "DSNW276d9298",
        distanceMeters: 204,
        rxPowerDbm: -20.3,
    });
});
