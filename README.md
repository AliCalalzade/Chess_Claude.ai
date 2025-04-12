# React Native Şahmat Oyunu

Bu layihə React Native istifadə edərək hazırlanmış tam funksional şahmat oyunudur. Oyun bütün şahmat fiqurlarının standart hərəkət qaydalarını, şah və mat vəziyyətlərini dəstəkləyir.

<img src='https://github.com/AliCalalzade/Chess_Claude.ai/blob/cc2df8dccded0a6ff8cc6f4aa0276558cc88a3b6/assets/Ekran%20Resmi%202025-04-12%2012.39.59.png' width='300px' height='500px' alt='no imgage'/>

## Xüsusiyyətlər

- Tam şahmat qaydaları tətbiqi
- Bütün fiqurlar üçün etibarlı hərəkət məntiqləri:
  - Piyada: Normal irəliləmə, ilk gediş zamanı ikiqat irəliləmə, çapraz yemə
  - Top: Üfüqi və şaquli istiqamətdə limitsiz hərəkət
  - At: L şəklində hərəkət
  - Fil: Çapraz istiqamətdə limitsiz hərəkət
  - Vəzir: Top və filin hərəkətlərinin birləşməsi
  - Şah: Hər istiqamətdə bir xana hərəkət
- Şah vəziyyətinin aşkarlanması və vizual göstərilməsi
- Mat vəziyyətinin yoxlanılması və oyun sonu bildirişi
- Pat vəziyyətinin (heç-heçə) aşkarlanması
- Piyadaların vəzirə çevrilməsi
- Növbə izləməsi (ağ/qara)
- Etibarlı gedişlərin vizual göstərilməsi
- Oyunu sıfırlama seçimi

## Quraşdırma

1. Layihəni klonlayın:
```bash
git clone https://github.com/AliCalalzade/Chess_Claude.ai.git
cd Chess_Claude.ai
```

2. Asılılıqları yükləyin:
```bash
npm install
# və ya
yarn install
```

3. Tətbiqi işə salın:
```bash
# All platform
npx expo start
# iOS üçün
npx react-native run-ios
# Android üçün
npx react-native run-android
```

## İstifadə qaydası

1. Oyun başladıqda ilk gediş ağ tərəfindədir.
2. Hərəkət etdirmək istədiyiniz fiqura toxunun.
3. Etibarlı hədəf xanalar rəngli olaraq vurğulanacaq:
   - Yaşıl: Boş xanaya gediş
   - Qırmızı: Rəqib fiqurunu yemə gedişi
4. Hədəf xanaya toxunaraq gedişinizi tamamlayın.
5. Şah vəziyyətində, təhlükə altındakı şah qırmızı olaraq vurğulanır.
6. Mat olduqda və ya pat vəziyyətində oyun sonu bildirilir.
7. "Oyunu Sıfırla" düyməsi ilə istədiyiniz zaman yeni oyuna başlaya bilərsiniz.

## Oyun Məntiqi

Oyun aşağıdakı əsas funksiyalarla işləyir:

- `getValidMoves`: Seçilmiş fiqur üçün etibarlı gedişləri hesablayır
- `isKingInCheck`: Şah vəziyyətini yoxlayır
- `makeMove`: Fiquru hərəkət etdirir və oyun vəziyyətini yeniləyir
- `checkForAvailableMoves`: Mat və pat vəziyyətlərini aşkarlayır

## İnkişaf

Layihəyə töhfə vermək üçün aşağıdakı sahələrdə təkmilləşdirmələr edə bilərsiniz:

- Qala (Castling) qaydasının əlavə edilməsi
- Keçərkən tutma (En passant) qaydasının əlavə edilməsi
- Oyun tarixçəsini saxlama və gedişləri geri alma
- Oyun zamanlayıcısı əlavə etmə
- Onlayn çox oyunçulu rejim
- Kompüter rəqibi AI əlavə edilməsi
- Mövzu seçimləri və vizual təkmilləşdirmələr
