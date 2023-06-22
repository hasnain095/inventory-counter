# Inventory Counter
Django app that lets you add/update inventory via speech using API provided by OpenAI's Whisper AI


# Setup
1. Clone the git repo ```git clone https://github.com/hasnain095/inventory-counter```
2. Setup python3 virtual environment ```python -m venv vevn_inventory_counter```
3. Open the terminal and navigate to the inventory counter folder ```cd inventory-counter```
4. Install requirements ```pip install -r requirements.txt```
5. Migrate Django app ```./manage.py migrate```
6. Launch Django app ```./manage.py runserver```
7. Open browser ```http://localhost:8000```
8. Press the "Start Recording" button
9. Speak sentences like "10 apples, 12 oranges, 24 computers"
10. Press the "Stop Recording" button
11. You will be presented with updated inventory counts.

   


