import { PrismaClient } from '@prisma/client'
// import * as data from '../src/data/store_data.json';

const prisma = new PrismaClient();

// async function seedData() {
//     data?.['DATA']?.map(async (store) => {
//         const storeData = {
//             phone: store?.tel_no,
//             address: store?.rdn_code_nm,
//             lat: store?.y_dnts,
//             lng: store?.x_cnts,
//             name: store?.upso_nm,
//             category: store?.bizcnd_code_nm,
//             storeType: store?.cob_code_nm,
//             foodCertifyName: store?.crtfc_gbn_nm,
//         };
//
//         const res = await prisma.store.create({
//             data: storeData,
//         });
//         console.log(res);
//     });
// }

async function main() {
    // await seedData();
}

main().catch((e) => {
    console.log(e);
    process.exit(1);    // 0 정상 종료(에러 없음), 1 비정상 종료(오류 발생)
})
    .finally(() => {
        prisma.$disconnect();   // prisma에서 $을 붙이면 일반 메서드가 아닌 특수한 prisma client api 를 의미함
                                // EX: $connect -> DB연결    $transaction() -> 트랜잭션 실행
    });