# CRM MCP Tools Skill

This skill provides guidance on using the **MCP Toolbox for Databases** within the ISP CRM Portal project.

## Overview

The ISP CRM Portal uses a SQLite database (`crm.sqlite`). To interact with this database efficiently, use the `toolbox-sqlite` MCP server. These tools allow for safe, parameterized, and standardized database operations.

## Available Tools

### 1. `mcp_toolbox-sqlite_list_tables`
Use this tool to list all available tables in the database.
- **When to use**: To explore the schema or verify that a table exists.
- **Output**: A list of table names and metadata.

### 2. `mcp_toolbox-sqlite_execute_sql`
The primary tool for data manipulation and complex queries.
- **When to use**: 
    - Fetching specific data (e.g., "Find all active customers").
    - Schema updates (e.g., `ALTER TABLE`).
    - Debugging data inconsistencies.
- **Best Practice**: Use standard SQL. For SQLite-specific inspection, use `PRAGMA` commands (e.g., `PRAGMA table_info(table_name)`).

## Common Operations

### Searching for Customers
Instead of reading the entire `customers` table, use a targeted query:
```sql
SELECT * FROM customers WHERE last_name LIKE '%Kwiatkowski%';
```

### Checking Recent Support Tickets
```sql
SELECT t.title, t.status, c.last_name 
FROM support_tickets t 
JOIN customers c ON t.customer_id = c.id 
ORDER BY t.created_at DESC LIMIT 5;
```

### Verifying Table Schema
To see columns and types:
```sql
PRAGMA table_info(customers);
```

## Safety Guidelines
1. **Backups**: Before performing destructive operations (`DELETE`, `DROP`), ensure the server is stopped and a backup of `crm.sqlite` is available.
2. **Read-Only First**: Always start with a `SELECT` query to verify your filters before running an `UPDATE` or `DELETE`.
3. **Transaction Safety**: The MCP tools handle single statements. For multi-statement transactions, ensure logic is sound.
