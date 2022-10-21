import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {NotFound, Unauthorized} from "./routes/error";
import {FirstSignInPasswordChange, ForgotPassword, ForgotPasswordConfirmationCode, SignIn} from "./routes/outer";
import {
    CloseInspection,
    InspectionDetail,
    Inspections,
    ModifyInspection,
    PlanInspection
} from "./routes/inner/inspections";
import ProtectedRoute from "./routes/ProtectedRoute";
import {getSessionData} from "./util/sessionDataUtil";
import {AddUser, Users} from "./routes/inner/users";
import {AddArea, AreaDetail, Areas, ElementDetail, ModifyArea, TransferElement} from "./routes/inner/areas";
import {ModifySpoilageAgents, SpoilageAgents} from "./routes/inner/spoilageAgents";
import {AddCompany, AddResponsible, Responsible} from "./routes/inner/responsible";
import {SessionData} from "./types/common.types";
import {UserType} from "./types/user.types";
import UnprotectedRoute from "./routes/UnprotectedRoute";

const App : React.FC = () =>  {

    const sessionData : SessionData | null  = getSessionData();
    const userType : UserType | undefined = sessionData?.user.type;


    return (
        <BrowserRouter>
            <Routes>
                <Route  path='/unauthorized' element={<Unauthorized/>}/>
                <Route  path='/' element={ sessionData ? <Navigate to={ userType !== 'SUPER_USER' ? "/inspections" : "/users"} replace/> : <SignIn/>}/>
                <Route element={<UnprotectedRoute/>}>
                    <Route  path='/forgot-password' element={<ForgotPassword/>}/>
                    <Route  path='/forgot-password-code' element={<ForgotPasswordConfirmationCode/>}/>
                    <Route  path='/change-password' element={<FirstSignInPasswordChange/>}/>
                </Route>
                <Route element={<ProtectedRoute usersWithAccess={['ADMIN_USER', 'OPERATIVE_USER']}/>}>
                    <Route  path='/inspections' element={ <Inspections/>}/>
                    <Route  path='/inspections/:inspectionId' element={ <InspectionDetail/>}/>
                    <Route  path='/spoilage-agents' element={ <SpoilageAgents/>}/>
                    <Route  path='/areas/:areaId' element={ <AreaDetail/>}/>
                    <Route  path='/areas/:areaId/element/:elementId' element={ <ElementDetail/>}/>
                </Route>
                <Route element={<ProtectedRoute usersWithAccess={['ADMIN_USER', 'SUPER_USER']}/>}>
                    <Route  path='/users' element={ <Users/>}/>
                </Route>
                <Route element={<ProtectedRoute usersWithAccess={['ADMIN_USER']}/>}>
                    <Route  path='/areas' element={ <Areas/>}/>
                    <Route  path='/areas/add-area' element={ <AddArea/>}/>
                    <Route  path='/areas/:areaId/modify-area' element={ <ModifyArea/>}/>
                    <Route  path='/areas/:areaId/element/:elementId/transfer-element' element={ <TransferElement/>}/>
                    <Route  path='/inspections/plan-inspection' element={ <PlanInspection/>}/>
                    <Route  path='/inspections/:inspectionId/close-inspection' element={ <CloseInspection/>}/>
                    <Route  path='/inspections/:inspectionId/modify-inspection' element={ <ModifyInspection/>}/>
                    <Route  path='/spoilage-agents/modify-spoilage-agents' element={ <ModifySpoilageAgents/>}/>
                    <Route  path='/responsible' element={ <Responsible/>}/>
                    <Route  path='/responsible/add-responsible' element={ <AddResponsible/>}/>
                    <Route  path='/responsible/add-company' element={ <AddCompany/>}/>
                </Route>
                <Route element={<ProtectedRoute usersWithAccess={['SUPER_USER']}/>}>
                    <Route  path='/users/add-user' element={ <AddUser/>}/>
                </Route>
                <Route path='*' element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
