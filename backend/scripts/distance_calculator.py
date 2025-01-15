import os
import sys
import pandas as pd
from geopy.distance import geodesic
import json

def calculate_total_distance(employee_data):
    total_distance = 0.0
    for i in range(len(employee_data) - 1):
        current_row = employee_data.iloc[i]
        next_row = employee_data.iloc[i + 1]
        if current_row['LoginStatus'] == 'Login' and next_row['LoginStatus'] == 'LogOut':
            coord1 = (current_row['Latitude'], current_row['Longitude'])
            coord2 = (next_row['Latitude'], next_row['Longitude'])
            total_distance += geodesic(coord1, coord2).kilometers
    return total_distance

def main(file_path):
    file_path = os.path.abspath(file_path)
    data = pd.read_excel(file_path)
    data['LoginDateTime'] = pd.to_datetime(data['LoginDateTime'], errors='coerce')
    data = data.dropna(subset=['Latitude', 'Longitude', 'LoginDateTime'])
    data = data.sort_values(by=['EmployeeId', 'LoginDateTime'])
    
    total_distances = data.groupby('EmployeeId').apply(calculate_total_distance)
    total_distances.name = 'TotalDistance'
    result = total_distances.reset_index().to_dict(orient='records')
    print(json.dumps(result))

if __name__ == "__main__":
    main(sys.argv[1])
