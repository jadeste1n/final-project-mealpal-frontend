import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const CreateRecipe = () => {

	const navigate = useNavigate();
	const [useFridge,setUseFridge] = useState(false);
	const [mealType, setMealType] = useState('dinner');
	const [maxreadyTime, SetMaxReadyTime] = useState(30);

	const handleGenerate = () => {
		const queryParams = new URLSearchParams()
			if (useFridge) queryParams.set('fridge', 'true');
			else {
				queryParams.set('mealType',mealType);
				queryParams.set('maxReadyTime', maxreadyTime);
			}
			navigate(`/recipes/suggestions?${queryParams.toString()}`);
	};

	return (
		<div className='p-4'>
			<h1 className='text-2x1 font-bold mb-4'> Create a Recipe Plan</h1>
			<label className='block mb-2'>
				<input type="checkbox" checked = {useFridge} onChange={(e) => setUseFridge(e.target.checked)} />
				{''} Use ingredients from fridge
				</label>
				{!useFridge && (
					<div className='space-y-4 mt-4'> <div>
						<label className='block text-sm font-medium'> Meal Type</label>
						<select className='border p-2 rounded w-full' value={mealType} on onChange={(e) => setMealType(e.target.value)}>
							<option value="breakfast"> Breakfast</option>
							<option value="lunch">Lunch</option>
							<option value="dinner"> Dinner</option>
							<option value="snack">Snack</option>
						</select>
					</div>

					<div>
						<label className='block text-sm font-medium'>Max Ready Time (mins)</label>
						<input type="number" min = {5} max = {60} value = {maxreadyTime} onChange={(e) => SetMaxReadyTime(Number(e.target.value))} className='border p-2 rounded w-full' />
					</div>

					</div>
				)}
				<button onClick={handleGenerate} className='mt-4 bg-blue-600 text-white px-4 py-2 rounded'>Generate Recipes</button>
		</div>
	);
};

export default CreateRecipe;