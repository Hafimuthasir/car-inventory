from fastapi import APIRouter, HTTPException, status, Depends
from .models import Car
from .schemas import CarSchema, CarGetSchema, CarUpdateSchema, CarCreateSchema
import logging
from fastapi import Query
from typing import Optional,List
from mongoengine.queryset.visitor import Q
from app.models import User
from app.security import authenticate_user
from cachetools import cached, TTLCache


router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
cache = TTLCache(maxsize=100, ttl=300)


# def invalidate_cache():
#     cache.delete("filter_cars")
#     cache.delete("search_cars")


# def cache_invalidator(func):
#     async def wrapper(*args, **kwargs):
#         result = await func(*args, **kwargs)
#         invalidate_cache()
#         return result

#     return wrapper

def invalidate_cache(*args, **kwargs):
    for key in list(cache):
        if key.startswith("filter_cars") or key.startswith("search_cars"):
            cache.pop(key)

@router.post("/", response_model=dict)
# @cache_invalidator
def create_car(car: CarCreateSchema, current_user : User=Depends(authenticate_user)):
    try:
        new_car = Car(make=car.make, model=car.model, engine_capacity=car.engine_capacity,
                      power=car.power, torque=car.torque, user=str(current_user.id))
        new_car.save()
        cache.clear()
        return {"message":"Added Successfully"}    
    except Exception as e:
        logger.info(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    


@router.put("/{car_id}", response_model=dict)
# @cache_invalidator
def update_car(car_id: str, car_data: CarUpdateSchema, current_user:User=Depends(authenticate_user)):
    try:
        car = Car.objects(id=car_id).first()
        if not car:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")

        for field, value in car_data.dict().items():
            if value is not None:
                setattr(car, field, value)
        car.save()
        cache.clear()
        return {"message": "Car updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{car_id}", response_model=dict)
# @cache_invalidator
def delete_car(car_id: str,
               current_user: User = Depends(authenticate_user)):
    try:
        car = Car.objects(id=car_id).first()
        if not car:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
        
        car.delete()
        cache.clear()
        return {"message": "Car deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    

@router.get("/filter", response_model=List[CarGetSchema])
@cached(cache)
def filter_cars(make: Optional[str] = None,
                model: Optional[str] = None,
                min_engine_capacity: Optional[float] = None,
                max_engine_capacity: Optional[float] = None,
                min_power: Optional[int] = None,
                max_power: Optional[int] = None,
                min_torque: Optional[int] = None,
                max_torque: Optional[int] = None,
            current_user: User = Depends(authenticate_user)
                ):
    try:
        query_params = {
            'user': current_user
        }
        if make:
            query_params["make__icontains"] = make
        if model:
            query_params["model__icontains"] = model
        if min_engine_capacity:
            query_params["engine_capacity__gte"] = min_engine_capacity
        if max_engine_capacity:
            query_params["engine_capacity__lte"] = max_engine_capacity
        if min_power:
            query_params["power__gte"] = min_power
        if max_power:
            query_params["power__lte"] = max_power
        if min_torque:
            query_params["torque__gte"] = min_torque
        if max_torque:
            query_params["torque__lte"] = max_torque

        filtered_cars = Car.objects(**query_params)
        
        serialized_results = []
        for car in filtered_cars:
            car_data = car.to_mongo().to_dict()
            car_data['_id'] = str(car.id)
            serialized_results.append(CarGetSchema(**car_data))

        return serialized_results
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    

    
@router.get("/search/", response_model=List[CarGetSchema])
@cached(cache)
def search_cars(keyword: str,current_user: User = Depends(authenticate_user)):
    try:
        search_results = Car.objects(user=current_user.id).filter(
            Q(make__icontains=keyword) | Q(model__icontains=keyword)
        )
        serialized_results = []
        for car in search_results:
            car_data = car.to_mongo().to_dict()
            car_data['_id'] = str(car.id)
            serialized_results.append(CarGetSchema(**car_data))
        
        return serialized_results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))