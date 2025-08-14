import MainRouter from './MainRouter';
import React, { memo, useState } from 'react';
import Loader from "../../Components/Loader";
import { Routes, Route } from 'react-router-dom';

const LoadingSpinner = memo(() => (
    <Loader />
));

LoadingSpinner.displayName = 'LoadingSpinner';

const App = () => {
    // const isAuthenticated = useSelector(selectIsAuthenticated);
    const [isLoading, setIsLoading] = useState(false);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            {/*<AuthRouter/>*/}
            <MainRouter/>
        </>
    );
};

export default App;
