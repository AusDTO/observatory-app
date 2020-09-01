echo "hello"
echo "NOTIFY_TEST_KEY=$NOTIFY_TEST_KEY" >> .env
echo $NODE_ENV

echo "$SERVER_CA" >> server-ca.pem
echo "$CLIENT_KEY" >> client-key.pem
echo "$CLIENT_CERT" >> client-cert.pem