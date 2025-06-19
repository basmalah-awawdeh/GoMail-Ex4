import socket
import sys

# connect to the server and sends user commands
def main(ip, port):
    # open a TCP connection to the server
    with socket.create_connection((ip, int(port))) as sock:
        while True:
            try:
                # get command from the user
                command = input(">> ").strip()
                if not command:
                    continue # skip empty input

                # send commant to a server
                sock.sendall((command + "\n").encode())
                # get and show the response
                data = sock.recv(4096).decode()
                print(data)
            except (KeyboardInterrupt, EOFError):
                break

# entry point of the script
if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python client.py <server_ip> <port>")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
