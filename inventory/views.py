import os
import whisper

from django.shortcuts import render
from django.conf import settings
from django.views import View
from django.http import JsonResponse

from .utils import process_text

class IndexView(View):
    template_name = "index.html"

    def get(self, request, *args, **kwargs):
        '''
        Returns the template index.html rendered

                Parameters:
                        request (Request): A HttpRequest object

                Returns:
                        template (html): HTML template
        '''
        return render(request, self.template_name, {"request": request, "text": ""})

    def post(self, request, *args, **kwargs):
        '''
        Returns the template index.html rendered after processing the request audio

                Parameters:
                        request (Request): A HttpRequest object
                        audio (MultipartFile): An audio file

                Returns:
                        template (html): HTML template
        '''
        file = request.FILES["audio"]
        destination_path = os.path.join(settings.MEDIA_ROOT, "audio.mp3")


        with open(destination_path, 'wb') as destination_file:
            for chunk in file.chunks():
                destination_file.write(chunk)

        whisper.DecodingOptions(language= 'en', fp16=False)

        model = whisper.load_model("base")
        result = model.transcribe(destination_path)
        text = result["text"]
        try:
            items = process_text(text)
        except Exception as e:
            print(e)
            return JsonResponse({ "text": text, "error": True})
        return JsonResponse({"text": text, 'items': items})
