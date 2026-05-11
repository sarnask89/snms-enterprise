import requests

def test_route(url):
    headers = {
        "HX-Request": "true",
        "HX-Target": "main-area"
    }
    # Skip auth for now to check if the route returns anything
    # (Actually we need to be logged in)
    session = requests.Session()
    # Login (assuming admin:admin)
    # This depends on your local dev settings
    r = session.post("http://127.0.0.1:8080/login", data={"username": "admin", "password": "admin"}, allow_redirects=True)
    
    print(f"Testing {url}...")
    r = session.get(url, headers=headers)
    print(f"Status: {r.status_code}")
    print(f"Content Length: {len(r.text)}")
    if r.status_code == 200:
        if "id=\"main-area\"" in r.text:
            print("Fragment OK (contains main-area)")
        else:
            print("Fragment ERROR (main-area missing)")
            print(r.text[:500])
    else:
        print(f"Error Content: {r.text[:500]}")

if __name__ == "__main__":
    test_route("http://127.0.0.1:8080/admin/menu-access")
    test_route("http://127.0.0.1:8080/admin/discovery")
