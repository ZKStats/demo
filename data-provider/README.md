# Data Provider

## Getting Started

Install poetry
```bash
```

Clone ZKStats python library
```bash
git clone https://github.com/ZKStats/zk-stats-lib
cd zk-stats-lib
```

Install ZKStats python library
```bash
poetry build && poetry install
```

Enable the environment that contains `zkstats-cli`
```bash
poetry shell
```

Start the data provider
```bash
yarn start
```

Proof, verification key, and settings will be generated in `out` folder. `kzg.srs` is generated too but data consumer should already have it previously.

```
% ll out
total 299328
drwxr-xr-x  11 mhchia  staff        352 Dec 13 00:10 .
drwxr-xr-x  12 mhchia  staff        384 Dec 13 00:16 ..
-rw-r--r--   1 mhchia  staff       1818 Dec 13 00:11 comb_data.json
-rw-r--r--   1 mhchia  staff    2097412 Dec 13 00:11 kzg.srs         <-- srs
-rw-r--r--   1 mhchia  staff      11952 Dec 13 00:11 model.compiled
-rw-r--r--   1 mhchia  staff       1116 Dec 13 00:11 model.onnx
-rw-r--r--   1 mhchia  staff      55194 Dec 13 00:11 model.pf        <-- proof
-rw-r--r--   1 mhchia  staff  143693720 Dec 13 00:11 model.pk
-rw-r--r--   1 mhchia  staff      38472 Dec 13 00:11 model.vk        <-- verification key
-rw-r--r--   1 mhchia  staff        660 Dec 13 00:11 settings.json   <-- settings
-rw-r--r--   1 mhchia  staff      25273 Dec 13 00:11 witness.json
```

