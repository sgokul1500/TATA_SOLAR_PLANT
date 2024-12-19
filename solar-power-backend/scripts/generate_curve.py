import sys
import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import interp1d
import json
import base64
from io import BytesIO

def generate_solar_curve(ac_capacity, dc_capacity, incremental_dc_capacity, time_interval):
    time = np.linspace(0, time_interval, 100)
    base_curve = np.sin(np.pi * time / time_interval)
    base_curve = np.maximum(0, base_curve)
    
    original_curve = base_curve * dc_capacity
    incremented_curve = base_curve * (dc_capacity + incremental_dc_capacity)
    
    original_curve = np.minimum(original_curve, ac_capacity)
    incremented_curve = np.minimum(incremented_curve, ac_capacity)
    
    plt.figure(figsize=(10, 6))
    plt.plot(time, original_curve, 'b-', label='Original Curve')
    plt.plot(time, incremented_curve, 'r--', label='Incremented Curve')
    plt.axhline(y=ac_capacity, color='g', linestyle=':', label='AC Capacity')
    
    plt.xlabel('Time (minutes)')
    plt.ylabel('Power (MW)')
    plt.title('Solar Power Generation Curve')
    plt.grid(True)
    plt.legend()
    
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode()
    plt.close()
    
    result = {
        'graph': image_base64,
        'original_curve': original_curve.tolist(),
        'incremented_curve': incremented_curve.tolist()
    }
    
    print(json.dumps(result))

if __name__ == "__main__":
    try:
        ac_capacity = float(sys.argv[1])
        dc_capacity = float(sys.argv[2])
        incremental_dc_capacity = float(sys.argv[3])
        time_interval = int(sys.argv[4])
        
        generate_solar_curve(ac_capacity, dc_capacity, incremental_dc_capacity, time_interval)
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)