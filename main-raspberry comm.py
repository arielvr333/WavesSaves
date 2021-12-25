import socket

localIP = "192.168.1.18"

localPort = 20001

bufferSize = 1024

msgFromServer = "Got your message"

bytesToSend = str.encode(msgFromServer)

# Create a datagram socket

UDPServerSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)

# Bind to address and ip

UDPServerSocket.bind((localIP, localPort))

print("UDP server up and listening")

# Listen for incoming datagrams

while (True):
    bytesAddressPair = UDPServerSocket.recvfrom(bufferSize)

    message = bytesAddressPair[0]

    address = bytesAddressPair[1]

    clientMsg = "{}".format(message)

    print(clientMsg)
   
    # Sending a reply to client

    UDPServerSocket.sendto(bytesToSend, address)
