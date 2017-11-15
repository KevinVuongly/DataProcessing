import csv
import json
import sys


def convertCSVtoJSON(csvfile):
    csv_filename = str(csvfile)
    json_filename = csv_filename.split('.')[0] + '.json'
    
    print('Opening CSV file: {}'.format(csv_filename))

    with open(csv_filename) as csvfile:

        readcsv = csv.reader(csvfile, delimiter=',')
        data_list = list()
        
        for row in readcsv:
            data_list.append(row)

        data = [dict(zip(data_list[0],row)) for row in data_list]
        data.pop(0)
        
        jsondata = json.dumps(data, sort_keys=True, indent=4)
        print(jsondata)

        print('Saving JSON file: {}'.format(json_filename))
        
        with open(json_filename, 'w') as outfile:
            outfile.write(jsondata)

    print('converted!')
    
if __name__== '__main__':
    convertCSVtoJSON(sys.argv[1])
