import xml.etree.ElementTree as ET
tree = ET.parse('times.xml')
root = tree.getroot()

print( ET.tostring(root[1][0][6]) )