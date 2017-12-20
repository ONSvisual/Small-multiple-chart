# CPI tool
Tool to visualise experimental CPI indices created from web scraped data.

To access the tool visit https://onsprices.github.io/PricesTool/index.html (Development version)

TO DO:

- [ ]  Labels following mouse
- [x]  Zoom Option
- [x]  Level structure
- [x]  Define data structure


### Data structure
```
.
See test json files in data folder
+-- Monthly
  +-- Level 1
    +-- Alcoholic{}
      +-- [All item{}]...
    +-- Food & Non-Alcoholic
      +-- [All item{}]...
+-- Weekly
+-- Level 1
  +-- Alcoholic{}
    +-- [All item{}]...
  +-- Food & Non-Alcoholic
    +-- [All item{}]...
```

### Data point
```
{"Monthly": {"1": {"Food": [{"category": "010106Apples Dessert Per Kg", "index": "GEKS", "date": "01/06/14", "value": 100.0},...
```
