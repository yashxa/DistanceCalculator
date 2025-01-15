# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Create a virtual environment for Python dependencies
RUN python3 -m venv /opt/venv
# Activate the virtual environment and install requirements
RUN /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r backend/scripts/requirements.txt

# Add the virtual environment to the PATH (runtime use)
ENV PATH="/opt/venv/bin:$PATH"

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
