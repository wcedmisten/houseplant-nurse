import csv
import urllib.request
from bs4 import BeautifulSoup

plant_care_page = "https://extension.uga.edu/publications/detail.html?number=B1318&title=Growing%20Indoor%20Plants%20with%20Success#:~:text=The%20secret%20to%20fertilizing%20plants,plant's%20need%20for%20fertilizer%20reduces."
page = urllib.request.urlopen(plant_care_page)

soup = BeautifulSoup(page, 'html.parser')

table = soup.find_all("table")[2] # find the table corresponding to care data (3rd table)
table_body = table.find('tbody')

data = []

rows = table_body.find_all('tr')
for row in rows:
    cols = row.find_all('td')
    cols = [ele.text.strip() for ele in cols]
    data.append([ele for ele in cols if ele]) # Get rid of empty values

with open('plant_care_data.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['scientific_name','common_name','light','temperature','humidity','watering','soil'])
    for i, row in enumerate(data[3:]): # skip the header data in this table
        writer.writerow([i] + row)