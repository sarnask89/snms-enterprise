"""Add apartment_number to Customer

Revision ID: ba770759f17f
Revises: b71c34a21a55
Create Date: 2026-04-27 14:19:14.326149

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ba770759f17f'
down_revision: Union[str, Sequence[str], None] = 'b71c34a21a55'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    
    # Customers columns
    columns = [c['name'] for c in inspector.get_columns('customers')]
    with op.batch_alter_table('customers', schema=None) as batch_op:
        if 'apartment_number' not in columns:
            batch_op.add_column(sa.Column('apartment_number', sa.String(length=32), nullable=True))

    # NetDevices columns
    columns = [c['name'] for c in inspector.get_columns('net_devices')]
    with op.batch_alter_table('net_devices', schema=None) as batch_op:
        if 'serial_number' not in columns:
            batch_op.add_column(sa.Column('serial_number', sa.String(length=128), nullable=True))
        if 'mac_address' not in columns:
            batch_op.add_column(sa.Column('mac_address', sa.String(length=32), nullable=True))

    # Nodes columns
    columns = [c['name'] for c in inspector.get_columns('nodes')]
    with op.batch_alter_table('nodes', schema=None) as batch_op:
        if 'name' not in columns:
            batch_op.add_column(sa.Column('name', sa.String(length=128), nullable=True))
        if 'login' not in columns:
            batch_op.add_column(sa.Column('login', sa.String(length=64), nullable=True))
        if 'passwd' not in columns:
            batch_op.add_column(sa.Column('passwd', sa.String(length=64), nullable=True))

    # Subscriptions
    with op.batch_alter_table('subscriptions', schema=None) as batch_op:
        batch_op.alter_column('technology',
               existing_type=sa.VARCHAR(length=8),
               nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('subscriptions', schema=None) as batch_op:
        batch_op.alter_column('technology',
               existing_type=sa.VARCHAR(length=8),
               nullable=True)

    with op.batch_alter_table('nodes', schema=None) as batch_op:
        batch_op.drop_column('passwd')
        batch_op.drop_column('login')
        batch_op.drop_column('name')

    with op.batch_alter_table('net_devices', schema=None) as batch_op:
        batch_op.drop_column('mac_address')
        batch_op.drop_column('serial_number')

    with op.batch_alter_table('customers', schema=None) as batch_op:
        batch_op.drop_column('apartment_number')
