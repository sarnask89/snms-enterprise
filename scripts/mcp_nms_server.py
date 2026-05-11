import asyncio
import logging
import os
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
import mcp.types as types
from mcp.server.stdio import stdio_server

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mcp_nms_server")

# Create a server instance
server = Server("nms-worker-server")

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """List available NMS tools."""
    return [
        types.Tool(
            name="analyze_network_logs",
            description="Analyzes network logs for anomalies using AI logic.",
            inputSchema={
                "type": "object",
                "properties": {
                    "logs": {"type": "string", "description": "Raw log data from the device."},
                },
                "required": ["logs"],
            },
        ),
        types.Tool(
            name="calculate_traffic_forecast",
            description="Predicts next hour traffic based on historical data.",
            inputSchema={
                "type": "object",
                "properties": {
                    "history": {
                        "type": "array",
                        "items": {"type": "number"},
                        "description": "Last 24 hours of traffic data points.",
                    },
                },
                "required": ["history"],
            },
        ),
    ]

@server.call_tool()
async def handle_call_tool(
    name: str, arguments: dict | None
) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
    """Handle tool calls."""
    if name == "analyze_network_logs":
        logs = arguments.get("logs", "")
        # Simulated AI logic (Phase 3 will integrate with Gemma NIM here)
        if "timeout" in logs.lower() or "error" in logs.lower():
            analysis = "🚨 Wykryto błędy komunikacji. Sugerowane sprawdzenie warstwy fizycznej."
        else:
            analysis = "✅ Logi nie wykazują krytycznych błędów."
        
        return [types.TextContent(type="text", text=analysis)]

    elif name == "calculate_traffic_forecast":
        history = arguments.get("history", [])
        if not history:
            return [types.TextContent(type="text", text="Brak danych do prognozy.")]
        
        # Simple moving average for simulation
        forecast = sum(history[-5:]) / 5 * 1.1 # 10% expected growth
        return [types.TextContent(type="text", text=f"Przewidywany ruch: {forecast:.2f} Mbps")]

    else:
        raise ValueError(f"Unknown tool: {name}")

async def main():
    # Run the server using stdin/stdout streams
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="nms-worker-server",
                server_version="0.1.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )

if __name__ == "__main__":
    asyncio.run(main())
