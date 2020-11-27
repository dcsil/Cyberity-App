import sklearn
import scipy
import numpy
import pandas

AUTH_FILE = 'previewauth.txt'
PROC_FILE = 'previewproc.txt'
FLOWS_FILE = 'previewflows.txt'
RED_FILE = 'redteam.txt'


def load_data():
    # load data in pandas dataframe
auth_data = pandas.read_csv(AUTH_FILE, usecols=[0,1,3,8], names=['time', 'user', 'src_comp', 'auth_status'])
proc_data = pandas.read_csv(PROC_FILE, usecols=[0,1,2,4], names=['time', 'user', 'comp', 'event'])
red_data = pandas.read_csv(RED_FILE, names=['time', 'user', 'src_comp', 'dst_comp'])

# Remove the @domain for user auths
auth_data['user'] = auth_data.user.str.extract("(.*)@")
# Add a hour column
auth_data['hour'] = auth_data['time'] // (60*60)
# Calculate the number of Fail/Success logins per hour per user
auth_data = auth_data.pivot_table(index=['hour', 'user'], columns='auth_status', aggfunc='size', fill_value=0)

# Remove the @domain for user process event
proc_data['user'] = proc_data.user.str.extract("(.*)@")
# Add a hour column
proc_data['hour'] = proc_data['time'] // (60*60)
# Calculate the number of Start/Stop events per hour per user
proc_data = proc_data.pivot_table(index=['hour', 'user'], columns='event', aggfunc='size', fill_value=0)

# Merge process and auth data
df = auth_data.merge(proc_data, how='left', left_index=True, right_index=True).fillna(0)

num_hours = df.reset_index().hour.max()
hourly_avgs = df.groupby('user').sum() / num_hours
hourly_avgs = hourly_avgs.reset_index().rename(columns={
    "Fail": "h_avg_Fail",
    "Success": "h_avg_Success",
    "End": "h_avg_End",
    "Start": "h_avg_Start"
})

# Merge hourly user and hourly average
df = df.merge(hourly_avgs, how='left', on='user').fillna(0)

return(df)


def main():
    df = load_data()
    

if __name__ == '__main__':
    main()