import {Routes,Route, Navigate} from 'react-router-dom';
import CreateRecipe from 'src/pages/recipes/CreateRecipe.jsx';
import RecipeDetails from 'src/pages/recipes/RecipeDetails.jsx';
import SuggestedRecipe from 'src/pages/recipes/SuggestedRecipe.jsx';
import RecipeOverview from 'src/pages/recipes/RecipeOverview.jsx';

const RecipeRoute = () => {
    return (
        <Routes>
            <Route path='/'element={<RecipeOverview/>} />
            <Route path='/create' element={<CreateRecipe/>} />
            <Route path='/details' element={<RecipeDetails/>} />
            <Route path='/suggestions' element={<SuggestedRecipe/>} />
            
        </Routes>
    );
};
export default RecipeRoute;