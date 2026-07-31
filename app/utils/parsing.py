import ast
import operator
import logging
from typing import Optional, Any

logger = logging.getLogger("app.utils.parsing")

def parse_int(value: Any, default: int = 0) -> int:
    """
    Safely parses a value to an integer. 
    Returns the default value if parsing fails or value is None.
    """
    if value is None:
        return default
    try:
        # Handle string stripping and potential float-like strings
        s = str(value).strip()
        if not s:
            return default
        # If there's a dot, it might be a string float "1.0", convert to float first
        if "." in s:
            return int(float(s))
        return int(s)
    except (ValueError, TypeError):
        return default

def parse_int_optional(value: Any) -> Optional[int]:
    """
    Safely parses a value to an integer.
    Returns None if parsing fails, value is None, or value is an empty string.
    """
    if value is None:
        return None
    try:
        s = str(value).strip()
        if not s:
            return None
        if "." in s:
            return int(float(s))
        return int(s)
    except (ValueError, TypeError):
        return None

def safe_eval(expr: str) -> Any:
    """
    Safely evaluates a simple mathematical or comparison expression.
    Supported: numbers, basic arithmetic, comparisons.
    """
    operators = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.USub: operator.neg,
        ast.UAdd: operator.pos,
        ast.Gt: operator.gt,
        ast.Lt: operator.lt,
        ast.GtE: operator.ge,
        ast.LtE: operator.le,
        ast.Eq: operator.eq,
        ast.NotEq: operator.ne,
    }

    def _eval(node):
        if isinstance(node, ast.Constant):
            return node.value
        elif isinstance(node, ast.BinOp):
            return operators[type(node.op)](_eval(node.left), _eval(node.right))
        elif isinstance(node, ast.UnaryOp):
            return operators[type(node.op)](_eval(node.operand))
        elif isinstance(node, ast.Compare):
            left = _eval(node.left)
            for op, right in zip(node.ops, node.comparators):
                if not operators[type(op)](left, _eval(right)):
                    return False
                left = _eval(right)
            return True
        elif isinstance(node, ast.Expression):
            return _eval(node.body)
        else:
            raise TypeError(f"Unsupported expression node: {type(node)}")

    try:
        tree = ast.parse(expr.strip(), mode='eval')
        return _eval(tree)
    except Exception as e:
        logger.error(f"Safe eval failed for expression '{expr}': {e}")
        raise ValueError(f"Invalid or unsafe expression: {expr}") from e
