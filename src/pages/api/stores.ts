import type {NextApiRequest, NextApiResponse} from "next";
import {StoreApiResponse, StoreType} from "@/interface";
import {PrismaClient} from "@prisma/client";
import axios from "axios";

interface ResponseType {
    page?: string;
    limit?: string;
    q?: string;
    district?: string;
    id?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StoreApiResponse | StoreType[] | StoreType>,
) {
    const {page = "", limit = "", q, district, id}:  ResponseType  = req.query;
    const prisma = new PrismaClient();

    if(req.method === "POST"){
        // 데이터 생성을 처리한다.
        const formData = req.body;
        const headers = {
            Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
        };
        const { data } = await axios.get(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(formData.address)}`, {headers});

        const result = await prisma.store.create({
            data: {...formData, lat:data.documents[0].y, lng: data.documents[0].x},
        });

        return res.status(200).json(result);
    } else if (req.method === "PUT") {
        // 데이터 수정을 처리한다.
        const formData = req.body;
        const headers = {
            Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
        };
        const { data } = await axios.get(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(formData.address)}`, {headers});

        const result = await prisma.store.update({
            where: {id: formData.id},
            data: {...formData, lat:data.documents[0].y, lng: data.documents[0].x},
        });
        return res.status(200).json(result);
    } else if (req.method === "DELETE") {
        // 데이터 삭제를 처리한다.
        if(id){
            const result = await prisma.store.delete({
                where: {
                    id: parseInt(id),
                },
            });

            return res.status(200).json(result);
        }
        return res.status(500).json(null);
    } else {
        // GET 요청 처리

        if (page) {
            const count = await prisma.store.count();
            const skipPage = parseInt(page) - 1;
            const stores = await prisma.store.findMany({
                orderBy: {id: "asc"},
                where: {
                    name: q ? { contains: q} : {},
                    address : district ? { contains: district} : {},
                },
                take: parseInt(limit),
                skip: skipPage * 10,
            });

            // totalPage, data, page, totalCount

            res.status(200).json({
                page: parseInt(page),
                data: stores,
                totalCount: count,
                totalPage: Math.ceil(count / 10),
            });
        } else {
            const {id}:{id?:string} = req.query;
            const stores = await prisma.store.findMany({
                orderBy: {id: "asc"},
                where: {
                    id: id ? parseInt(id) : {},
                },
            });

            return res.status(200).json(id ? stores[0] : stores);
        }
    }
}