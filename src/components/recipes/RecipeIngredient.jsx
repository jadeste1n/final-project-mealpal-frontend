import React from 'react';

const RecipeIngredients = ({recipe, onclose}) => {
    if (!recipe) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10'>
            <div className='bg-white max-w-x1 w-full rounded-lg shadow-lg overflow-auto max-h-[90vh] p-4 relative'>
                <button className='absolute top-2 right-2 text-gray-500 hover:text-black' onClick={onclose}>X</button>
                <h2 className='text-xl font-semibold mb-4'>{recipe.title}</h2>
                <img src={recipe.image} alt={recipe.title} className='w-full h-40 object-cover mb-4' />
                <div className='mb-4'>
                    <h3 className='text-lg font-semibold'>Ingredients</h3>
                    <ul className='list-disc list-inside text-sm text-gray-700'>
                        {recipe.ingredients.map((item, idx)=> (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className='mb-4'>
                    <h3 className='text-lg font-semibold'>Instructions</h3>
                    <ol className='list-decimal list-inside text-sm text-gray-700'>
                        {recipe.instructions.map((step, idx) => (
                            <li key={idx}>{step}</li>
                        ))}
                    </ol>
                </div>

                <div className='text-sm text-gray-600'>
                    <strong>Calories:</strong> {recipe.nutrition?.calories || 'N/A'} kcal <br />
                    <strong>Protien:</strong> {recipe.nutrition?.protein || 'N/A'} g <br />
                </div>
            </div>
        </div>
    );
};

export default RecipeIngredients;

// This component displays the recipe ingredients and instructions in a modal format.