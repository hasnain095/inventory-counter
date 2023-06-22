from django.db import transaction

from .models import Inventory


def process_text(text):
    '''
        Returns the processed inventory after processing the text
        Seperates each item and its count in the text


                Parameters:
                        text (String): A string object containing the text from audio

                Returns:
                        updated_inventory (dict): A dictionary containing the inventory items
        '''
    text = text.replace(".", "")
    
    # import pdb; pdb.set_trace()
    with transaction.atomic():
        inventory = {}
        if "," in text:
            inventory = {name.strip(): int(count) for count, name in (
                item.split() for item in text.split(','))}
        else:
            split_text = text.strip(" ")
            split_text = split_text.split(" ")
            inventory = {
                split_text[i + 1]: int(split_text[i]) for i in range(0, len(split_text), 2)}

        item_names = inventory.keys()
        already_exist = Inventory.objects.filter(name__in=item_names)
        already_exist_names = [inventory.name for inventory in already_exist]

        to_be_created = [{'name': item, 'count': inventory[item]}
                         for item in inventory if item not in already_exist_names]
        to_be_updated = [{'name': item, 'count': inventory[item]}
                         for item in inventory if item in already_exist_names]

        new_items = Inventory.objects.bulk_create(
            [Inventory(name=item['name'], count=item['count']) for item in to_be_created])

        for item in already_exist:
            item.count = inventory[item.name]

        updated_item_count = Inventory.objects.bulk_update(
            already_exist, ['count'])

    updated_inventory = [{'name': item.name, 'count': item.count}
                         for item in Inventory.objects.all()]
    return updated_inventory
