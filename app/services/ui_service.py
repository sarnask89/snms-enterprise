from fastapi import Request

class UIService:
    """Serwis zarządzający interfejsem użytkownika (UI Plugin)."""
    
    @staticmethod
    def get_theme_assets(request: Request):
        """Zwraca ścieżki do grafik zależnie od motywu (Dark/Light)."""
        theme = request.cookies.get("theme", "light") # Lub z localStorage via JS, ale tu z ciasteczka jeśli ustawione
        # W praktyce w base.html mamy JS który to obsłuży, ale tu przygotowujemy ścieżki
        
        prefix = "/static/images/"
        return {
            "logo_sidebar": f"{prefix}NetCoreOps_logo_sidebar_full.png",
            "logo_login": f"{prefix}NetCoreOps_logo_login.png",
            "bg_grid": f"{prefix}general/NetCoreOps_dark_bg_grid.png" if theme == "dark" else f"{prefix}general/NetCoreOps_light_bg_grid.png",
        }

    @staticmethod
    def get_breadcrumb(request: Request, title: str):
        """Generuje listę okruszków dla nawigacji."""
        path = request.url.path
        parts = [p for p in path.split("/") if p]
        
        breadcrumbs = [{"label": "Pulpit", "url": "/"}]
        
        current_url = ""
        for part in parts:
            current_url += f"/{part}"
            label = part.replace("-", " ").capitalize()
            # Mapowanie specjalne
            if part == "customers": label = "Klienci"
            elif part == "helpdesk": label = "Zgłoszenia"
            elif part == "finances": label = "Finanse"
            
            breadcrumbs.append({"label": label, "url": current_url})
            
        if title and (not breadcrumbs or breadcrumbs[-1]["label"] != title):
            breadcrumbs.append({"label": title, "url": path})
            
        return breadcrumbs

ui_service = UIService()
