# DeepSeek Context — Weekly Estimasi Order Excel

File dibaca: `WEEKLY_ESTIMASI_ORDER-197000357526070120348523.xlsx`

## Tujuan penggunaan
Gunakan file Excel ini sebagai acuan struktur data untuk membuat aplikasi import, edit, kalkulasi, rekap, dan export estimasi order mingguan. File ini lebih cocok disebut **template estimasi order** daripada dataset forecasting historis, karena semua kuantitas produk pada data saat ini masih 0.

## Struktur workbook

Workbook memiliki 3 sheet:

| Sheet | Range | Fungsi |
|---|---:|---|
| `2026-07-04` | `A1:CD107` | Sheet utama input order per toko dan produk |
| `Rekap` | `A1:D73` | Rekap total qty per produk/SKU |
| `Rekap by Type` | `A1:G353` | Rekap berdasarkan Store Type |

Metadata workbook:
- Periode: `(04/07/2026 - 04/07/2026)`
- Depo: `D/BGR/CITEREUP/PT. MUD/CBT`
- Date: `01/07/2026`

---

## Sheet utama: `2026-07-04`

### Struktur baris
- Row 1: product short name untuk kolom produk dari `P:CD`.
- Row 2: header kolom utama dan harga produk di kolom `P:CD`.
- Rows 3–96: data toko/customer, total 94 baris toko.
- Row 97: total per produk dan total nilai.
- Rows 98–107: baris tambahan per salesman untuk `kuota` dan `Total Estimasi`.

### Kolom utama

| Kolom | Nama | Keterangan |
|---|---|---|
| A | No | Nomor urut |
| B | Tanggal | Tanggal order |
| C | Salesman Code | Kode salesman |
| D | Salesman Name | Nama salesman |
| E | Store | Kode dan nama toko |
| F | Store Type | Tipe toko |
| G | Classification | Klasifikasi toko |
| H | Sales Type | Contoh: Consignment |
| I | Remarks | Catatan |
| J | Disc % | Diskon, default 10 |
| K | CBP | Gross amount berdasarkan qty x harga produk |
| L | RBP | CBP setelah diskon |
| M | RBP Net | RBP exclude PPN / dibagi 1.11 |
| N | Qty | Total qty semua SKU di baris toko |
| O | # Items | Jumlah SKU yang qty-nya > 0 |
| P:CD | SKU/Product columns | Qty order per SKU |

### Rumus penting di sheet utama

Untuk setiap baris toko `r`:
- `CBP` kolom K: `SUMPRODUCT(harga produk row 2, qty produk row r)`
  - Pada file asli dibuat sebagai formula panjang: `(P2*Pr)+(Q2*Qr)+...+(CD2*CDr)`
- `RBP` kolom L: `=K[r]-(K[r]*J[r]/100)`
- `RBP Net` kolom M: `=ROUND(L[r]/1.11, 2)`
- `Qty` kolom N: `=SUM(P[r]:CD[r])`
- `# Items` kolom O: `=COUNTIF(P[r]:CD[r],">0")`
- Row 97: total per kolom, misalnya `P97=SUM(P3:P96)`

### Jumlah data toko
Total baris toko aktif: **94**

Salesman:
| 71306761 | SMTR-01 | 20 |
| 71306762 | SMTR_02 | 20 |
| 71306763 | SMBL-01 | 16 |
| 71306764 | SMTR-03 | 22 |
| 71306765 | SMTR-04 | 16 |

Store Type:
| WARUNG NOO | 83 |
| MTI NOO | 8 |
| RUMAH SAKIT | 3 |

Classification:
| WARUNG NOO | 83 |
| MTI NOO | 8 |
| LAYANAN KESEHATAN | 3 |

Sales Type:
- Semua data toko menggunakan `Consignment`.

Catatan data:
- Semua nilai qty produk di rows 3–96 saat ini adalah 0.
- Karena qty masih 0, nilai CBP, RBP, RBP Net, Qty, dan # Items masih 0 atau kosong tergantung hasil kalkulasi Excel.

---

## Daftar produk/SKU dan harga

| No | Short Name | Harga |
|---:|---|---:|
| 1 | RTSII | 15000 |
| 2 | RTGII | 22000 |
| 3 | RTPDM2 | 19000 |
| 4 | RCC2 | 19500 |
| 5 | RTKL | 13500 |
| 6 | SCK2 | 6000 |
| 7 | SAB2 | 6000 |
| 8 | SAP2 | 6000 |
| 9 | SKJ2 | 6000 |
| 10 | SSM2 | 6000 |
| 11 | RKU2 | 18000 |
| 12 | RJKU II | 21000 |
| 13 | RMS II | 14500 |
| 14 | ZSCCK | 5000 |
| 15 | ZSCM | 5000 |
| 16 | ZSCS | 5000 |
| 17 | RJTS500 | 18000 |
| 18 | RJMS500 | 18000 |
| 19 | SCB | 6000 |
| 20 | ZSCST | 5000 |
| 21 | SGK | 6000 |
| 22 | DOT | 19500 |
| 23 | ICK GT II | 4500 |
| 24 | ICC II GT | 4500 |
| 25 | ISC GT | 4500 |
| 26 | IST GT | 4500 |
| 27 | IBL GT | 4500 |
| 28 | ICO GT | 4500 |
| 29 | IGC | 6000 |
| 30 | SRC III | 5500 |
| 31 | SCC III | 5500 |
| 32 | SRM III | 5500 |
| 33 | ZCRCC | 5500 |
| 34 | ZCRCR | 5500 |
| 35 | ZCRCB | 5500 |
| 36 | SRS | 5500 |
| 37 | ZCRGC | 6000 |
| 38 | DIC | 6500 |
| 39 | DCP | 6500 |
| 40 | DHF | 6000 |
| 41 | DST | 6500 |
| 42 | DPS | 6500 |
| 43 | DNS | 6500 |
| 44 | RKJ2 | 15000 |
| 45 | RSM2 | 11500 |
| 46 | RKS2 | 12000 |
| 47 | TOCII5S | 18000 |
| 48 | TCCII5S | 18000 |
| 49 | TCSII5S | 18000 |
| 50 | TSTII5S | 19000 |
| 51 | TCBII5S | 19000 |
| 52 | KKM | 12500 |
| 53 | RMNC | 8000 |
| 54 | RMNS | 8000 |
| 55 | TDOC 72 | 9000 |
| 56 | TDCC 72 | 9000 |
| 57 | TDCS 72 | 9000 |
| 58 | BURII | 11000 |
| 59 | CCC | 5000 |
| 60 | CCP | 5000 |
| 61 | CCMS | 5000 |
| 62 | STCB | 10000 |
| 63 | BMO | 5000 |
| 64 | WFO | 5000 |
| 65 | STCDC | 7000 |
| 66 | MNC | 6000 |
| 67 | BKOR | 11000 |

---

## Sheet `Rekap`

Range: `A1:D73`

Struktur:
- A1:B3 berisi metadata periode, depo, date.
- Row 6 header: `No`, `Short Name`, `QTY`, `TOTAL QTY`.
- Rows 7–73 berisi 67 SKU.
- Kolom C mengambil total dari row 97 sheet utama, contoh:
  - `C7='2026-07-04'!P97`
  - `C8='2026-07-04'!Q97`
  - ...
  - `C73='2026-07-04'!CD97`
- Kolom D sama dengan kolom C, contoh `D7=C7`.

---

## Sheet `Rekap by Type`

Range: `A1:G353`

Header row 5:
- `Main Store`
- `Klasifikasi`
- `Store Type`
- `QTY`
- `CBP`
- `RBP`
- `RBP Exclude PPN`

Catatan penting:
Formula di sheet ini terlihat perlu dicek ulang karena mapping kolom pada file saat ini tampak tidak sesuai header.

Formula asli yang terdeteksi:
- D/QTY menggunakan `SUMIF(..., L3:L96)` padahal L adalah `RBP`, bukan `Qty`.
- E/CBP menggunakan `SUMIF(..., I3:I96)` padahal I adalah `Remarks`, bukan `CBP`.
- F/RBP menggunakan `SUMIF(..., J3:J96)` padahal J adalah `Disc %`, bukan `RBP`.

Formula yang lebih logis:
- `D6 = SUMIF('2026-07-04'!F3:F96, C6, '2026-07-04'!N3:N96)` untuk QTY
- `E6 = SUMIF('2026-07-04'!F3:F96, C6, '2026-07-04'!K3:K96)` untuk CBP
- `F6 = SUMIF('2026-07-04'!F3:F96, C6, '2026-07-04'!L3:L96)` untuk RBP
- `G6 = ROUND(F6/1.11, 0)` untuk RBP Exclude PPN

---

# Prompt untuk DeepSeek

Tolong buat aplikasi web untuk membaca dan mengolah file Excel estimasi order mingguan berdasarkan struktur berikut.

## Stack
Gunakan:
- Next.js
- TypeScript
- Tailwind CSS
- SheetJS/xlsx untuk membaca dan menulis Excel
- Tidak perlu database untuk versi MVP
- Semua proses dilakukan setelah user upload file Excel

## Input
User upload file Excel dengan 3 sheet:
1. `2026-07-04` atau sheet utama tanggal lain dengan format mirip
2. `Rekap`
3. `Rekap by Type`

Sheet utama memiliki range kira-kira `A1:CD107`.
Kolom A–O adalah metadata dan kolom kalkulasi.
Kolom P–CD adalah produk/SKU.
Row 1 kolom P–CD berisi short name SKU.
Row 2 kolom P–CD berisi harga SKU.
Rows 3–96 berisi data toko.
Row 97 adalah total.
Rows 98–107 adalah baris kuota/total estimasi per salesman.

## Fitur MVP
1. Upload Excel.
2. Parse sheet utama otomatis, jangan hardcode nama sheet tanggal; pilih sheet pertama sebagai sheet utama jika formatnya cocok.
3. Tampilkan data toko dalam tabel:
   - Tanggal
   - Salesman Code
   - Salesman Name
   - Store
   - Store Type
   - Classification
   - Sales Type
   - Disc %
   - CBP
   - RBP
   - RBP Net
   - Qty
   - # Items
4. Tampilkan matrix input qty produk:
   - Baris = toko
   - Kolom = SKU produk
   - Qty bisa diedit.
5. Kalkulasi otomatis:
   - CBP = total dari qty SKU x harga SKU
   - RBP = CBP - diskon
   - RBP Net = RBP / 1.11
   - Qty = sum semua qty SKU
   - # Items = count SKU dengan qty > 0
6. Buat tab Rekap Produk:
   - Short Name
   - Harga
   - Total Qty
   - Total CBP
7. Buat tab Rekap by Store Type:
   - Store Type
   - Total Qty
   - Total CBP
   - Total RBP
   - Total RBP Exclude PPN
8. Export hasil ke Excel:
   - Sheet utama
   - Rekap
   - Rekap by Type
9. Validasi:
   - Qty harus angka >= 0
   - Disc % default 10 jika kosong
   - Toko tanpa qty tetap boleh tampil
   - Formula tidak perlu disimpan sebagai formula Excel, boleh dihitung di aplikasi lalu diexport sebagai nilai. Tapi lebih bagus jika export tetap menyertakan formula sederhana.

## Data model internal yang disarankan

```ts
type Product = {
  sku: string;
  price: number;
  columnKey: string;
};

type StoreOrder = {
  no: number;
  date: string;
  salesmanCode: string;
  salesmanName: string;
  store: string;
  storeType: string;
  classification: string;
  salesType: string;
  remarks?: string;
  discountPercent: number;
  quantities: Record<string, number>;
  cbp: number;
  rbp: number;
  rbpNet: number;
  totalQty: number;
  itemCount: number;
};

type ProductRecap = {
  sku: string;
  price: number;
  totalQty: number;
  totalCbp: number;
};

type StoreTypeRecap = {
  storeType: string;
  totalQty: number;
  totalCbp: number;
  totalRbp: number;
  totalRbpNet: number;
};
```

## Parsing rules
- Ambil product list dari row 1 dan row 2 sheet utama, mulai kolom P sampai kolom terakhir CD.
- Ambil store rows dari row 3 sampai sebelum baris `Total`.
- Deteksi baris total jika kolom B berisi `Total`.
- Deteksi baris kuota/estimasi jika kolom E berisi `kuota` atau `Total Estimasi`.
- Jangan memasukkan row total dan row kuota sebagai store order.
- Gunakan Store Type dari kolom F untuk rekap by type.
- Gunakan Classification dari kolom G untuk filter tambahan.

## Output UI
Buat halaman dengan:
- Upload area
- Summary cards:
  - Total Store
  - Total Salesman
  - Total SKU
  - Total Qty
  - Total CBP
  - Total RBP
- Tabel Store Orders
- Tabel Product Recap
- Tabel Store Type Recap
- Tombol Download Excel

## Catatan bug/formula dari file asli
Pada sheet `Rekap by Type`, formula terlihat salah mapping:
- Header QTY seharusnya mengambil kolom N dari sheet utama.
- Header CBP seharusnya mengambil kolom K dari sheet utama.
- Header RBP seharusnya mengambil kolom L dari sheet utama.
Jadi saat implementasi, gunakan mapping yang benar, bukan formula asli yang salah.
