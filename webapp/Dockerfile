FROM node:15.8.0

COPY client/ client/
# install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt update && apt install -y yarn \
    && rm -rf /var/lib/apt/lists/*

# build the React client
RUN cd client && yarn install && yarn build

# install Golang
RUN wget https://golang.org/dl/go1.15.8.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.15.8.linux-amd64.tar.gz

ENV PATH=$PATH:/usr/local/go/bin
ENV GOPATH=$HOME
ENV GOBIN=$GOPATH/bin

COPY backend/ backend/

RUN cd backend/ && go get && go install

# run the backend
CMD go run backend/main.go