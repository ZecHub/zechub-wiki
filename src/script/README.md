# To work with this script folder which contains python `".py"` file(s), it's required to create a python `virtual environment` on your machines:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## NOTE
Add the environment folder to .gitignore: If you use the standard venv folder, add this to your .gitignore file:

```text
venv/
.venv/
env/
__pycache__/
*.pyc
```

## NOTE:
Usage:
To update the map with new ambassdors, the file `ambassador_list_v2.json` located at `./src/app/zcash-global-ambassadors/ambassador_list_v2.json` should be updated with the ambassador's information as outlined therein.

After that, the following command should be executed via the shell/terminal or command prompt

```bash
python3 ./src/script/ambassador_geo_data/build_ambassadors_geojson.py  --input ./src/app/zcash-global-ambassadors/ambassador_list_v2.json --output ./public/map-data/ambassadors.geojson
```
