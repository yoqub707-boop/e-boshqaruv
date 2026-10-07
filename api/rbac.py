# Huquqlar (Ruxsatnomalar)
PERMISSIONS = {
    "MAYOR": ["READ", "CREATE", "UPDATE", "DELETE"],
    "DEPUTY_ECONOMY": ["READ", "CREATE", "UPDATE"],
    "DEPUTY_SOCIAL": ["READ", "CREATE", "UPDATE"],
    "DEPUTY_CONSTRUCTION": ["READ", "CREATE", "UPDATE"],
    "HEAD_FINANCE": ["READ", "CREATE"],
    "HEAD_TAX": ["READ", "CREATE"]
}

# Foydalanuvchining huquqlarini olish
def get_permissions_for_role(role: str) -> list:
    return PERMISSIONS.get(role, ["READ"])
