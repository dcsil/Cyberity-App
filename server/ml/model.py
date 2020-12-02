import sklearn
from sklearn.neural_network import MLPRegressor
import matplotlib.pyplot as plt
import numpy as np
import scipy
import numpy
import pandas
import joblib

AUTH_FILE = 'previewauth.txt'
PROC_FILE = 'previewproc.txt'
FLOWS_FILE = 'previewflows.txt'
RED_FILE = 'redteam.txt'

MODEL_FILENAME = 'trained_model.sav'

def save_model(model, filename=MODEL_FILENAME):
    joblib.dump(model, filename)

def load_model(filename):
    loaded_model = joblib.load(filename)
    return loaded_model

def data_encoder(data, reg):
    # Encode first layer 
    encoder = np.asmatrix(data)

    for i in range(3):
        encoder = encoder*reg.coefs_[i] + reg.intercepts_[i]
        encoder = (np.exp(encoder) - np.exp(-encoder))/(np.exp(encoder) + np.exp(-encoder))

    # Return the bottleneck array
    return np.asarray(encoder)


def visualize_bottleneck(bottleneck_data, testing=None):
    # Plot data to visual bottleneck values
    plt.scatter(bottleneck_data[:, 0], bottleneck_data[:, 1])
    if testing is not None:
        plt.scatter(testing[:, 0], testing[:, 1], c='red')
        
    plt.title('Bottleneck Space')
    plt.xlabel('Z1')
    plt.ylabel('Z2')
    plt.axis('equal')
    plt.savefig('bottleneck.png')
    plt.clf()


def load_data(auth_file=AUTH_FILE, proc_file=PROC_FILE):
    # load data in pandas dataframe
    auth_data = pandas.read_csv(auth_file, usecols=[0,1,3,8], names=['time', 'user', 'src_comp', 'auth_status'])
    proc_data = pandas.read_csv(proc_file, usecols=[0,1,2,4], names=['time', 'user', 'comp', 'event'])

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
    df = df.reset_index().merge(hourly_avgs, how='left', on='user').fillna(0)

    # Remove anonymous logins and return
    return df.drop(0).to_numpy()


def get_testing_data(auth_file, proc_file, red_file):
    # Get the data in correct format corresponding to the data corresponding with the red_file data
    auth_data = pandas.read_csv(auth_file, usecols=[0,1,3,8], names=['time', 'user', 'src_comp', 'auth_status'])
    proc_data = pandas.read_csv(proc_file, usecols=[0,1,2,4], names=['time', 'user', 'comp', 'event'])
    red_data = pandas.read_csv(red_file, usecols=[0,1], names=['time', 'user'])

    auth_data['user'] = auth_data.user.str.extract("(.*)@")
    auth_data['hour'] = auth_data['time'] // (60*60)
    auth_data = auth_data.pivot_table(index=['hour', 'user'], columns='auth_status', aggfunc='size', fill_value=0)

    proc_data['user'] = proc_data.user.str.extract("(.*)@")
    proc_data['hour'] = proc_data['time'] // (60*60)
    proc_data = proc_data.pivot_table(index=['hour', 'user'], columns='event', aggfunc='size', fill_value=0)

    red_data['user'] = red_data.user.str.extract("(.*)@")
    red_data['hour'] = red_data['time'] // (60*60)
    red_data = red_data.drop(columns="time")

    # Merge process and auth data
    df = auth_data.merge(proc_data, how='left', left_index=True, right_index=True).fillna(0)
    df = red_data.merge(df, on=['hour', 'user']).set_index(['hour', 'user'])

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

    return df.to_numpy()



def train_model(data_x):
    # Model Strcuture
    n_input = 8
    n_encoder1 = 6  # Encoder structure
    n_encoder2 = 4
    n_bottleneck = 2
    n_decoder1 = 4 # Decoder structure
    n_decoder2 = 4
    hidden_layer_sizes = (n_encoder1, n_encoder2, n_bottleneck, n_decoder1, n_decoder2)

    reg = MLPRegressor(
            hidden_layer_sizes = hidden_layer_sizes, 
            activation = 'tanh', 
            solver = 'adam', 
            max_iter=10000,
            learning_rate_init = 0.001,
            learning_rate='adaptive',
            verbose = True)

    reg.fit(data_x, data_x)
    
    return reg



def main():
    # print("Loading & Processing Data")
    # data = load_data()
    # save_model(data, "data.sav")

    # print("Training Model")
    # reg = train_model(data)
    # save_model(reg, "trained_model.sav")

    # print("Processing Testing Data")
    # test_rows = get_testing_data("previewauthtests.txt", "previewproctests.txt", RED_FILE)
    # save_model(test_rows, "testing_data.sav")

    # Detect anomalous behviour given the processed data logs 
    print("Loading Data From File")
    data = load_model("data.sav")
    time = data[:,0]
    users = data[:,1]
    data = data[:,2:]
    
    print("Loading Model From File")
    reg = load_model("trained_model.sav")
    flagged = []
    for i in range(len(data)):
        pred = reg.predict(data[i].reshape(1, -1))
        s = sklearn.metrics.r2_score(data[i], pred[0])
        if s < -3700:
            flagged.append((users[i], time[i]))
    

    # print("Loading Red Testing Data From File")
    # test_rows = load_model("testing_data.sav")

    # print("Visualizing bottleneck data points")
    # encoded = data_encoder(data, reg)
    # red_tests_encoded = data_encoder(test_rows, reg)
    # visualize_bottleneck(encoded, red_tests_encoded)


if __name__ == '__main__':
    main()