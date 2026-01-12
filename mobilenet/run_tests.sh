#!/bin/bash

# Find all .mjs files in the tests/ directory and run them with Node.js
for test_file in tests/*.js; do
  echo "Running $test_file..."
  node "$test_file"
  echo "----------------------------------------"
done

