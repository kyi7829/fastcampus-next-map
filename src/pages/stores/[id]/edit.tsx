import { useRouter } from "next/router";
import axios from "axios";
import {toast} from "react-toastify";
import {CATEGORY_ARR, FOOD_CERTIFY_ARR, STORE_TYPE_ARR} from "@/data/store";
import AddressSearch from "@/components/AddressSearch";
import {useForm} from "react-hook-form";
import {StoreType} from "@/interface";
import {useQuery} from "react-query";

export default function StoreEditPage(){
    const router = useRouter();
    const {id} = router.query;

    const fetchStore = async () => {
        const {data} = await axios(`/api/stores?id=${id}`);
        return data as StoreType;
    };

    const { register, handleSubmit, formState: {errors}, setValue} = useForm<StoreType>();
    const {data : store, isFetching, isSuccess, isError, } = useQuery(`store-${id}`, fetchStore, {
        onSuccess: (data) => {
            setValue("id", data.id);
            setValue("name", data.name);
            setValue("phone", data.phone);
            setValue("lat", data.lat);
            setValue("lng", data.lng);
            setValue("address", data.address);
            setValue("foodCertifyName", data.foodCertifyName);
            setValue("storeType", data.storeType);
            setValue("category", data.category);
        },
        refetchOnWindowFocus: false,
    });

    return (
        <form className="px-4 md:max-w-4xl mx-auto py-8" onSubmit={handleSubmit(async (data) =>{
            try {
                const result = await axios.put("/api/stores", data);

                if(result.status === 200){
                    // 성공
                    toast.success("맛집을 수정했습니다.");
                    router.replace(`/stores/${result.data.id}`);
                } else {
                    // 실패
                    toast.error("다시 시도해주세요.");
                }
            } catch (e){
                console.log(e);
                toast.error("데이터 생성 중 문제가 생겼습니다. 다시 시도해주세요.");
            }
        })}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">맛집 수정</h2>
                    <p className="mt-1 text-sm/6 text-gray-600">아래 내용을 입력해서 맛집을 수정해주세요.</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                                가게명
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    {...register("name", {required: true})}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-none -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                {errors?.name?.type === 'required' && (
                                    <div className="pt-2 text-xs text-red-600">
                                        필수 입력사항입니다.
                                    </div>
                                ) }
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="category" className="block text-sm/6 font-medium text-gray-900">
                                카테고리
                            </label>
                            <div className="mt-2">
                                <select
                                    {...register("category", {required: true})}
                                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-none -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                >
                                    <option value="">카테고리 선택</option>
                                    {CATEGORY_ARR?.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                {errors?.category?.type === 'required' && (
                                    <div className="pt-2 text-xs text-red-600">
                                        필수 입력사항입니다.
                                    </div>
                                ) }
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900">
                                연락처
                            </label>
                            <div className="mt-2">
                                <input
                                    {...register("phone", {required: true})}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-none -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                {errors?.phone?.type === 'required' && (
                                    <div className="pt-2 text-xs text-red-600">
                                        필수 입력사항입니다.
                                    </div>
                                ) }
                            </div>
                        </div>

                        <AddressSearch setValue={setValue} register={register} errors={errors}/>

                        <div className="sm:col-span-2 sm:col-start-1">
                            <label htmlFor="foodCertifyName" className="block text-sm/6 font-medium text-gray-900">
                                식품인증구분
                            </label>
                            <div className="mt-2">
                                <select
                                    {...register("foodCertifyName",{required: true})}
                                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-none -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                >
                                    <option value="">식품인증구분 선택</option>
                                    {FOOD_CERTIFY_ARR?.map((data)=>(
                                        <option key={data} value={data}>{data}</option>
                                    ))}
                                </select>
                                {errors?.foodCertifyName?.type === 'required' && (
                                    <div className="pt-2 text-xs text-red-600">
                                        필수 입력사항입니다.
                                    </div>
                                ) }
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="storeType" className="block text-sm/6 font-medium text-gray-900">
                                업종구분
                            </label>
                            <div className="mt-2">
                                <select
                                    {...register("storeType",{required: true})}
                                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-none -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                >
                                    <option value="">업종구분 선택</option>
                                    {STORE_TYPE_ARR?.map((data)=>(
                                        <option key={data} value={data}>{data}</option>
                                    ))}
                                </select>
                                {errors?.storeType?.type === 'required' && (
                                    <div className="pt-2 text-xs text-red-600">
                                        필수 입력사항입니다.
                                    </div>
                                ) }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    onClick={()=> router.back()}
                    className="text-sm/6 font-semibold text-gray-900">
                    뒤로가기
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    수정하기
                </button>
            </div>
        </form>
    );
}