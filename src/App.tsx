import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./shared/components/Layout";
import CampaignList from "./features/campaigns/CampaignList";
import CampaignDetail from "./features/campaigns/CampaignDetail";
import EditCampaign from "./features/campaigns/EditCampaign";
import Settings from "./features/settings/Settings";
import AddCampaign from "./features/campaigns/AddCampaign.tsx";
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>

        <Route path="/" element={<Navigate to="/campaigns" />} />

        <Route path="/campaigns" element={<CampaignList />} />
        <Route path="/campaigns/:id" element={<CampaignDetail />} />
        <Route path="/campaigns/:id/edit" element={<EditCampaign />} />

        <Route path="/settings" element={<Settings />} />
<Route path="/campaigns/new" element={<AddCampaign />} />
      </Route>
    </Routes>
  );
}