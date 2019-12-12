import json

arr = []

with open("src/projects/giants/source.txt") as infile:
  for line in infile.readlines():
    if line[0].isdigit() or line[0] in ["-", " "]:
      arr.append([float(w) for w in line.strip().split(" ")])

print(len(arr))

for sub in arr:
  print(len(sub))

with open("src/projects/giants/target.json", "w") as outfile:
  json.dump(arr, outfile)