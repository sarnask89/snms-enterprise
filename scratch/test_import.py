import requests

url = "http://127.0.0.1:8080/admin/discovery/80/import-all"
res = requests.post(url)
print(res.status_code)
print(res.text)
