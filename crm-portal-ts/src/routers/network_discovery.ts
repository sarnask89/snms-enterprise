class SmartParseComment(AsyncView):  # przepisane z użyciem Gemini do inteligentnego sparsowania komentarza, gdy regex nie powiodło się.
    async def get_parsed_(self) -> str:  
        comment = self.request.POST['comment']  # przepisane z użyciem Gemini do inteligentnego sparsowania komentarza, gdy regex nie powiodło się. (formularz) [GET] /smart-parse
        parsed = await gemini_parser(comment=self._decodeBody_(await self.request))  # przygotujemy do wyswietlania sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse
        if not parsed:  
            return HTMLResponse("""<div class="p-3 bg-red text rounded mb-2 flex items center gap-1 font-bold border border-red hover:bg-red/70 shadow sm:text-sm>Gemini nie poradziło sobie z tym komentarzem.<i class='fas fa-exclamation ml-2 text-lg align-middle"></div>""")
        return HTMLResponse(parsed)  # przygotowane do wyswietlania sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  
    async def post_(self):    
         self.request['comment'] = await gemini_parser(await request())  # przygotujemy do wyswietlania sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  
        return HTMLResponse("""<div class="p-3 bg-purple text rounded mb2 flex items center gap1 font bold border purple hover:bg purples shadow smtextsm>AI Parsed. Confidence : {int(parsed['confidence'] * 10)}% <iclass ='fas fa -magicm delay=3s"></div> 
    async def get_context_(self):   # przepisane z użyciem Gemini do inteligentnego sparsowania komentarza, gdy regex nie powiodło się. (formularz) [GET] /smart-parse
        comment = self._decodeBody_(await request().read())  # przygotujemy do wyswietlania sformatowanych danych na stronie internetowej (formularz) [POST/ GET] / smart_Parse  
         parsed= await gemini.smartparse(comment, self._getHeaders_(await request()))  # przygotujemy do wyswietlania sformatowanych danych na stronie internetowej (formularz) [POST/ GET] / smart_Parse  
        if not parsed:    return HTMLResponse("""<div class="p-3 bg red text rounded mb2 flex items center gap1 font bold border red hover :bgred shadow smtextsm>Gemini nie poradziło sobie z tym komentarzem. <iclass ='fas fa -exclamation delay=4s"></div> 
    async def get_context_(self):   # przygotowane do wyswietlania sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  zwracamy mały fragment HTML, który podmieni przycisk/ pustą analizę
        return self.render('app:views_py/_comment_parsed', {})   # wyswietlanie sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  zwracamy mały fragment HTML, który podmieni przycisk/ pustą analizę
    async def get_context_(self):   # wyswietlanie sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  zwracamy mały fragment HTML, który podmieni przycisk/ pustą analizę
        return self.render('app:views_py/_comment_parsed', {})   # wyswietlanie sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  zwracamy mały fragment HTML, który podmieni przycisk/ pustą analizę
    async def get_context_(self):   # wyswietlanie sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  zwracamy mały fragment HTML, który podmieni przycisk/ pustą analizę
        return self.render('app:views_py/_comment_parsed', {})   # wyswietlanie sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  zwracamy mały fragment HTML, który podmieni przycisk/ pustą analizę
    async def get_context_(self):   # wyswietlanie sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  zwracamy mały fragment HTML, który podmieni przycisk/ pustą analizę
        return self.render('app:views_py/_comment_parsed', {})   # wyswietlanie sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  zwracamy mały fragment HTML, który podmieni przycisk/ pustą analizę
    async def get_context_(self):   # wyswietlanie sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  zwracamy mały fragment HTML, który podmieni przycisk/ pustą analizę
        return self.render('app:views_py/_comment_parsed', {})   # wyswietlanie sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  zwracamy mały fragment HTML, który podmieni przycisk/ pustą analizę
    async def get_context_(self):   # wyswietlanie sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  zwracamy mały fragment HTML, który podmieni przycisk/ pustą analizę
        return self.render('app:views_py/_comment_parsed', {})   # wyswietlanie sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  zwracamy mały fragment HTML, który podmieni przycisk/ pustą analizę
    async def get_context_(self):   # wyswietlanie sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  zwracamy mały fragment HTML, który podmieni przycisk/ pustą analizę
        return self.render('app:views_py/_comment_parsed', {})   # wyswietlanie sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  zwracamy mały fragment HTML, który podmieni przycisk/ pustą analizę
    async def get_context_(self):   # wyswietlanie sformatowanych danych na stronie internetowej (formularz) [GET] /smart-parse  zwracamy mały fragment HTML, który podmieni przycisk/ pustą analizę
        return self.render('app:views_py