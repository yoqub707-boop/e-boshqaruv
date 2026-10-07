# Role-Based Access Control (RBAC)

PERMISSIONS = {
    "MAYOR": ["READ"],
    "DEPUTY_ECONOMY": ["READ", "CREATE", "UPDATE", "DELETE"],
    "DEPUTY_SOCIAL": ["READ", "CREATE", "UPDATE", "DELETE"],
    "DEPUTY_CONSTRUCTION": ["READ", "CREATE", "UPDATE", "DELETE"],
    "DEPUTY_AGRICULTURE": ["READ", "CREATE", "UPDATE", "DELETE"],
    "MODERATOR": ["READ", "CREATE", "UPDATE", "DELETE"]
}

ROLE_DISPLAY_NAMES = {
    "MAYOR": "Tuman Hokimi",
    "DEPUTY_ECONOMY": "Iqtisodiyot bo'yicha o'rinbosar",
    "DEPUTY_SOCIAL": "Ijtimoiy masalalar bo'yicha o'rinbosar",
    "DEPUTY_CONSTRUCTION": "Qurilish bo'yicha o'rinbosar",
    "DEPUTY_AGRICULTURE": "Qishloq xo'jaligi bo'yicha o'rinbosar",
    "MODERATOR": "Moderator"
}

def get_permissions_for_role(role: str) -> list:
    return PERMISSIONS.get(role, ["READ"])

def get_role_display_name(role: str) -> str:
    return ROLE_DISPLAY_NAMES.get(role, role)
