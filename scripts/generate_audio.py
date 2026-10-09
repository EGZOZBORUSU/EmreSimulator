import asyncio
import os
import edge_tts

QUOTES = [
    # --- ÖZLÜ & SAHTE FELSEFİ ---
    {"id": "quote_3", "text": "Çünkü gitmek, bazen sadece bir montun fermuarını çekerken sıkışan astarı kurtarmaktı..."},
    {"id": "quote_4", "text": "Zaman, soğuyan bir çay tabağında unutulmuş ıslak küp şekerin son çaresizliğiydi..."},
    {"id": "quote_5", "text": "Biz seninle aynı dolmuşta farklı duraklarda inecek iki yabancı gibiydik; üstelik şoföre müsait bir yerde bile diyemedik..."},
    {"id": "quote_6", "text": "Bir insanın kalbi, bozuk bir para üstü gibiydi; sayarsın eksik çıkar, sormaya da utanırsın."},
    {"id": "quote_7", "text": "Sevgi neydi? Sevgi, arkadaşının Instagram story'sine attığı absürt fotoğrafı görüp hiçbir şey yazmadan sadece beğenmekti."},
    {"id": "quote_8", "text": "İçine attığın her şey, gün gelir içinde biriken o dipsiz kuyuda seni boğar..."},
    {"id": "quote_9", "text": "Kelimeler kifayetsiz değildi; biz sadece hangi dilde susacağımızı bilemedik..."},
    {"id": "quote_10", "text": "Bazen en büyük devrim, alarm çaldığında uyanıp tavanı on beş dakika boyunca izlemektir..."},
    {"id": "quote_53", "text": "Gözlerinin derinliğine baktım; orada sadece ödenmeyi bekleyen bir fatura ve derin bir keder gördüm..."},
    {"id": "quote_54", "text": "Bazen susmak; karşıdakinin cehaletine sunulmuş en asil, en sessiz merhamettir..."},
    {"id": "quote_55", "text": "Biz seninle aynı menemenin soğanlı mı soğansız mı olduğunu tartışırken ömrümüzü tükettik..."},
    {"id": "quote_56", "text": "Dünya yuvarlak falan değil; dünya düpedüz bir köşeye sıkışmışlıklar labirentidir..."},
    {"id": "quote_57", "text": "Bir erkeğin sessizliği fırtına öncesi sessizlik değil; sadece banka hesabındaki son bakiyeyi düşünmesidir..."},
    {"id": "quote_58", "text": "Geceleri tavana dikilen o boş gözler... Aslında ruhun kendi otopsisini yaptığı andır..."},

    # --- SERT & TOKAT GİBİ ---
    {"id": "quote_11", "text": "Bana öyle bakma sevgilim... Ben senin 'görüldü' atıp cevap vermediğin o kırk dakikalık boşlukta öldüm."},
    {"id": "quote_12", "text": "İçimdeki çocuğu öldürdüler demiyorum. Ama içimdeki çocuk şu an sanayide çırak olarak çalışıyor..."},
    {"id": "quote_13", "text": "Biz hayata bir sıfır geride başlamadık. Biz maçın kadrosuna bile alınmamıştık..."},
    {"id": "quote_14", "text": "Hayat dediğin; halı sahada son dakikada gelen pası auta vurup hiçbir şey olmamış gibi kramponunun bağcığını bağlamaktır."},
    {"id": "quote_15", "text": "Kafanın içindeki sesleri susturamıyorsan, dışarıdaki gürültüye dua etmeyi öğreneceksin."},
    {"id": "quote_16", "text": "Sana değer verdiğimi sanma; ben sadece yalnızlığımı paylaşacak daha ucuz bir muhatap bulamamıştım..."},
    {"id": "quote_17", "text": "İnsanlar ikiye ayrılır: Kazık yiyenler ve yediği kazığı hayat tecrübesi diye pazarlayanlar."},
    {"id": "quote_18", "text": "Düşene bir tekme de sen vurma derler; oysa hayat düşene duble yol yapar, üzerinden kamyon geçirir..."},
    {"id": "quote_19", "text": "Dostluk dediğin; arkandan konuşurken ses tonunu biraz alçaltma nezaketidir."},
    {"id": "quote_20", "text": "Kendini vazgeçilmez sanan herkesin yerini, bir gün adresi bulamamış bir kurye alır..."},
    {"id": "quote_59", "text": "Ruhun fahişeyse, giydiğin namus zırhı sadece üzerini terletir albayım..."},
    {"id": "quote_60", "text": "Kendi düşen ağlamaz derler; çünkü düştüğü yerde önce bir sağına soluna bakar rezil oldum mu diye..."},
    {"id": "quote_61", "text": "Bize 'bir ömür boyu' dediler, biz üçüncü ayda birbirimizin kusurlarını Excel tablosuna kaydediyorduk..."},
    {"id": "quote_62", "text": "Biz zafere inanmadık ki mağlup olalım; biz baştan hakemin satıldığını biliyorduk..."},

    # --- MELANKOLİK & HÜZÜNLÜ ---
    {"id": "quote_21", "text": "İnsan en çok, sabah çorabının teki bazanın altına kaçtığında anlardı yalnızlığı..."},
    {"id": "quote_22", "text": "Bazen vazgeçmek, şarj aletini prize takıp dolmadığını görünce kabloyu bükerek uyumaktı..."},
    {"id": "quote_23", "text": "Biz o gemiyi kaçırmadık kaptan. Biz o geminin batacağını bile bile iskelede simit kemirdik..."},
    {"id": "quote_24", "text": "Bir erkeğin en savunmasız anı, berberin saçını yıkayıp havluyla yüzünü kapattığı o beş saniyeydi..."},
    {"id": "quote_25", "text": "Sessizlik diyorum... En çok da WhatsApp grubunda espri yaptıktan sonra gelen o üç dakikalık ölüm sessizliğiydi."},
    {"id": "quote_26", "text": "Gecenin üçünde buzdolabının kapağını açıp ışığında beklemek, modern insanın ibadetidir..."},
    {"id": "quote_27", "text": "Büyümek neydi biliyor musun? Bayram sabahı yeni ayakkabılarla uyumayı bırakıp, ay sonu kira gününü beklemekti..."},
    {"id": "quote_28", "text": "Unutmak diye bir şey yok; sadece beynin acı çeken bölgesi zamanla hissizleşiyor."},
    {"id": "quote_29", "text": "Balkonda içilen o son sigaranın dumanı... Aslında içinden çıkamadığın sokakların haritasıydı."},
    {"id": "quote_30", "text": "Bazı insanlar yağmuru hisseder, bazıları ise sadece ıslanır... Biz ise su faturasını düşündük."},
    {"id": "quote_63", "text": "Gece saat üçte mutfak tezgahına oturup sigara yakmayan adam, yalnızlığın vergisini ödememiştir..."},
    {"id": "quote_64", "text": "Seni sevmek, ıslak elle prize dokunmak gibiydi; çarpılacağını bile bile o akıma muhtaç kalmaktı..."},
    {"id": "quote_65", "text": "Belki de kader; yanlış durakta indiğini son otobüs gittikten sonra fark etmektir..."},
    {"id": "quote_66", "text": "Cebinde beş kuruşun yokken kurduğun hayaller, sabah ezanıyla beraber dağılan duman gibidir..."},

    # --- MOTİVE EDİCİ & TOKSİK GRİNDSET ---
    {"id": "quote_31", "text": "Sabah beş buçukta uyanıp soğuk duş almayan adam, kaderin ona attığı sıcak tokadı hazmedemez!"},
    {"id": "quote_32", "text": "Mazeretler, fakirlerin birbirine ikram ettiği bayat lokumlar gibidir; yeme, yedirme!"},
    {"id": "quote_33", "text": "Aslanlar avlanırken ceylanın burcuna bakmaz. Kalk ve o Excel tablosunu bitir!"},
    {"id": "quote_34", "text": "Zirve tek kişiliktir yeğenim; çünkü asansörün taşıma kapasitesi en fazla seksen kilodur..."},
    {"id": "quote_35", "text": "Eğer bir hedefin yoksa, başkalarının hayatında piyon değil, sadece PowerPoint sunumundaki stok görsel olursun!"},
    {"id": "quote_36", "text": "Kaybetmek bir seçenek değildir; kaybetmek sadece şirketin iflas bayrağını çekmesidir."},
    {"id": "quote_37", "text": "Dün bitti, yarın şüpheli, bugün ise faturaların son ödeme tarihi... Çalış!"},
    {"id": "quote_38", "text": "Sana yapamazsın diyenlere inat, yapamadığını kanıtla ve onları bir kez daha haklı çıkar!"},
    {"id": "quote_39", "text": "Konfor alanı mezarlıktır. Eğer rahat uyuyorsan, batıyorsun demektir!"},
    {"id": "quote_40", "text": "Ağlamak kalori yakmaz; terle, çalış, hisse senedi al ve piyasayı domine et!"},

    # --- CİNSEL İÇERİKTE ABSÜRT & BİYOLOJİK GERÇEKLER ---
    {"id": "quote_41", "text": "Aşk dediğin; gecenin üçünde gelen 'uyudun mu?' mesajındaki o çaresiz, hüzünlü biyolojik kıpırtıydı..."},
    {"id": "quote_42", "text": "Biz seninle, son kullanma tarihi geçmiş bir prezervatifin vadettiği o sahte güven duygusu kadar çaresizdik..."},
    {"id": "quote_43", "text": "Ten tene değdiğinde duyulan o ses... Aslında iki yalnız insanın birbirine çarpan hayal kırıklıklarıydı..."},
    {"id": "quote_44", "text": "Bazen birini sevmek; sabah uyandığında lavabo deliğinde biriken saçları cımbızla çekerken hissettiğin o soğuk varoluştu..."},
    {"id": "quote_45", "text": "Bir prezervatif paketi yırtılırken çıkan o ses... Masumiyetin son fısıltısıydı belki de..."},
    {"id": "quote_46", "text": "Oysa biz sadece sevişmek değil, birbirimizin anksiyetesini boşaltmak istemiştik..."},
    {"id": "quote_47", "text": "Her orgazm, ölümün provalarından sadece biriydi. Biz provayı sevdik..."},
    {"id": "quote_48", "text": "Cinsellik; Tanrı'nın yalnız insanlara sunduğu en absürt, en terli barış antlaşmasıydı..."},
    {"id": "quote_49", "text": "İki çıplak beden karanlıkta birbirine sürtünürken; tek kazanan, kenarda sessizce dolan elektrik sayacıydı..."},
    {"id": "quote_50", "text": "Bazen arzu, asla gelmeyecek bir orgazmı beklerken duvardaki çatlağı saymaktı..."},
    {"id": "quote_51", "text": "Aşk biter, tutku söner, geriye sadece yıkanması gereken nevresim takımı kalır..."},
    {"id": "quote_52", "text": "Yatağın gıcırdayan sol ayağı gibiydi ilişkimiz; her heyecanlandığımızda bütün apartmana rezil olduk..."},
    {"id": "quote_67", "text": "Tenin kokusu hafızadan silinir ama o otel odasının anahtarını teslim ederken hissettiğin pişmanlık asla silinmez..."},
    {"id": "quote_68", "text": "Aşk bir trafik kazasıysa, biz emniyet kemeri takmadığı için ön camdan fırlayan iki aptaldık..."},
    {"id": "quote_69", "text": "Dudaktan dudağa geçen o sıvı sevgi değil, sadece karşılıklı mutsuzluğun asit dengesiydi..."},
    {"id": "quote_70", "text": "Çıplaklık yatakta değil; ay sonunda kredi kartı ekstresine bakarken başlar..."}
]

VOICE = "tr-TR-AhmetNeural"
RATE = "-15%"
PITCH = "-5Hz"

async def generate():
    output_dir = os.path.join("public", "audio", "quotes")
    os.makedirs(output_dir, exist_ok=True)
    print(f"Total curated quotes: {len(QUOTES)}. Checking audio files...")
    
    for i, item in enumerate(QUOTES):
        out_file = os.path.join(output_dir, f"{item['id']}.mp3")
        if os.path.exists(out_file) and os.path.getsize(out_file) > 1000:
            continue
        print(f"[{i+1}/{len(QUOTES)}] Generating {item['id']}...")
        communicate = edge_tts.Communicate(item["text"], VOICE, rate=RATE, pitch=PITCH)
        await communicate.save(out_file)

    print("Curated audio generation complete!")

if __name__ == "__main__":
    asyncio.run(generate())
