"""Increase customer_code length to 64

Revision ID: 65c5ede5bc6b
Revises: ba770759f17f
Create Date: 2026-04-27 14:31:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '65c5ede5bc6b'
down_revision: Union[str, Sequence[str], None] = 'ba770759f17f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table('customers', schema=None) as batch_op:
        batch_op.alter_column('customer_code',
               existing_type=sa.VARCHAR(length=32),
               type_=sa.String(length=64),
               existing_nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('customers', schema=None) as batch_op:
        batch_op.alter_column('customer_code',
               existing_type=sa.String(length=64),
               type_=sa.VARCHAR(length=32),
               existing_nullable=False)
