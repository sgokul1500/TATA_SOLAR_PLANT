import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
import json
import base64
from io import BytesIO

def plot_cumulative_energy_curve(file_data, start_date, end_date, incremental_gen_list):
    # Constants
    base_gen = 140  # Base generation in MW
    ac_limit = 110  # AC limit in MW
    ac_limit_mwh = ac_limit * 0.25  # Convert AC limit from MW to MWh

    try:
        # Load the Excel file from bytes
        df = pd.read_excel(BytesIO(file_data))

        # Clean and standardize the 'Time' column
        df["Time"] = df["Time"].str.extract(r"(\d{2}-\d{2}-\d{4} \d{2}:\d{2})")
        df["Time"] = pd.to_datetime(df["Time"], format="%d-%m-%Y %H:%M", errors="coerce")
        df = df.dropna(subset=["Time"])

        # Remove rows with negative or zero values
        df = df[df["Gen"] > 0]

        # Filter data within the date range
        start_date_dt = datetime.strptime(start_date, "%d-%m-%Y")
        end_date_dt = datetime.strptime(end_date, "%d-%m-%Y")
        mask = (df["Time"] >= start_date_dt) & (df["Time"] <= end_date_dt)
        df_filtered = df[mask]

        if df_filtered.empty:
            return {"error": "No data found for the specified date range."}

        # Group by time intervals and calculate average generation
        df_filtered["Time_15min"] = df_filtered["Time"].dt.time
        df_avg = df_filtered.groupby("Time_15min")["Gen"].mean()

        time_intervals = [t.strftime("%H:%M") for t in df_avg.index]
        gen_avg = df_avg.values

        results = []
        for inc_gen in incremental_gen_list:
            incremental_gen = base_gen + float(inc_gen)

            # Calculate energies
            energy_reference = gen_avg * 0.25
            gen_new_incremental = (gen_avg / base_gen) * incremental_gen
            energy_incremental = gen_new_incremental * 0.25
            energy_clipped = np.minimum(energy_incremental, ac_limit_mwh)

            # Calculate losses
            original_energy = df_filtered["Gen"].values * 0.25
            scaled_energy = (df_filtered["Gen"].values / base_gen) * incremental_gen * 0.25
            clipped_energy = np.minimum(scaled_energy, ac_limit_mwh)

            total_loss_without_clipping = float(np.sum(np.abs(original_energy - scaled_energy)))
            total_loss_with_clipping = float(np.sum(np.abs(original_energy - clipped_energy)))

            # Create plot
            plt.figure(figsize=(24, 12), dpi=300)
            plt.plot(range(len(time_intervals)), energy_reference,
                    label="Reference Curve (Energy, MWh)",
                    color="blue", linewidth=3, marker='o', markersize=6,
                    markerfacecolor='white', markeredgewidth=2)
            plt.plot(range(len(time_intervals)), energy_incremental,
                    label=f"Incremental Curve (Energy, Incremental Gen: {incremental_gen} MW)",
                    color="red", linewidth=3, marker='s', markersize=6,
                    markerfacecolor='white', markeredgewidth=2)
            plt.plot(range(len(time_intervals)), energy_clipped,
                    label="Clipped Incremental Curve (Energy, MWh)",
                    color="orange", linewidth=3, linestyle="--")
            
            plt.axhline(y=ac_limit_mwh, color="green", linestyle="--", linewidth=2,
                       label=f"AC Limit ({ac_limit} MW -> {ac_limit_mwh} MWh)")

            plt.xticks(range(len(time_intervals)),
                      [t for t in time_intervals],
                      rotation=45, fontsize=12, ha='right')
            plt.yticks(fontsize=12)
            plt.grid(True, linestyle='--', alpha=0.5)
            plt.xlabel("Time (15-min intervals)", fontsize=14, labelpad=10)
            plt.ylabel("Energy (MWh)", fontsize=14, labelpad=10)
            plt.title(f"Cumulative Energy Curve with Losses ({start_date} to {end_date})\nIncremental Gen: {incremental_gen} MW",
                     fontsize=16, pad=20)
            plt.legend(fontsize=14, loc='upper left', bbox_to_anchor=(1.02, 1))

            # Add loss information to plot
            plt.text(0.95, 0.95,
                    f'Total Loss (Without Clipping): {total_loss_without_clipping:.2f} MWh\n'
                    f'Total Loss (With Clipping): {total_loss_with_clipping:.2f} MWh',
                    transform=plt.gca().transAxes, fontsize=14,
                    bbox=dict(facecolor='white', alpha=0.8, edgecolor='black'),
                    ha='right', va='top')

            plt.margins(x=0.03, y=0.1)
            plt.tight_layout()

            # Convert plot to base64 image
            buffer = BytesIO()
            plt.savefig(buffer, format='png', bbox_inches='tight')
            buffer.seek(0)
            plot_base64 = base64.b64encode(buffer.getvalue()).decode()
            plt.close()

            results.append({
                "incremental_gen": incremental_gen,
                "plot": plot_base64,
                "energy_reference": energy_reference.tolist(),
                "energy_incremental": energy_incremental.tolist(),
                "energy_clipped": energy_clipped.tolist(),
                "losses": {
                    "without_clipping": total_loss_without_clipping,
                    "with_clipping": total_loss_with_clipping
                }
            })

        return {
            "time_intervals": time_intervals,
            "results": results,
            "ac_limit": ac_limit_mwh
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        file_data = sys.stdin.buffer.read()
        params = json.loads(sys.argv[1])
        result = plot_cumulative_energy_curve(
            file_data,
            params["start_date"],
            params["end_date"],
            params["incremental_gen_list"]
        )
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)