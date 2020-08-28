import React from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/layouts/AdminLayout";
import SEO from "../seo";

import PageAlert from "../../components/blocks/page-alert";
import {
  GetPropertiesAndUser_getUser,
  GetPropertiesAndUser_getUserProperties_PropertyList_properties,
} from "../../graphql/GetPropertiesAndUser";

interface Props {
  apiMessage?: string;
  properties?: Array<
    GetPropertiesAndUser_getUserProperties_PropertyList_properties
  >;
  userInfo: GetPropertiesAndUser_getUser;
}
// export class ChooseServicePage extends React.PureComponent<Props> {
//   render() {
//     const { apiMessage, properties, userInfo } = this.props;

//     const { name } = userInfo;

//     const renderProperties = () => {
//       if (properties && properties.length > 0) {
//         return (
//           <ul className="au-link-list">
//             {properties.map((property, i) => (
//               <li key={i}>
//                 <Link to={`/service/${property.id}`}>
//                   {property.service_name}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         );
//       }

//       if (apiMessage) {
//         return (
//           <PageAlert type="warning" className="max-42">
//             <>
//               <h3>Properties not found</h3>
//               <p>{apiMessage}</p>
//             </>
//           </PageAlert>
//         );
//       }
//     };

//     return (
//       <AdminLayout>
//         <>
//           {console.log("rendering")}
//           <SEO title="Home" />

//           <div className="container-fluid au-body">
//             <h1>Welcome back, {name}</h1>
//             <h2>Which property do you want to work with today</h2>
//             {renderProperties()}
//           </div>
//         </>
//       </AdminLayout>
//     );
//   }
// }
export const ChooseServicePage: React.FC<Props> = ({
  apiMessage,
  properties,
  userInfo,
}) => {
  const { name, agency, email } = userInfo;

  const renderProperties = () => {
    if (properties && properties.length > 0) {
      return (
        <ul className="au-link-list">
          {properties.map((property, i) => (
            <li key={i}>
              <Link to={`/service/${property.id}`}>
                {property.service_name}
              </Link>
            </li>
          ))}
        </ul>
      );
    }

    if (apiMessage) {
      return (
        <PageAlert type="warning" className="max-42">
          <>
            <h3>Properties not found</h3>
            <p>{apiMessage}</p>
          </>
        </PageAlert>
      );
    }
  };

  return (
    <AdminLayout>
      <>
        {console.log("rendering")}
        <SEO title="Home" />

        <div className="container-fluid au-body">
          <h1>Welcome back, {name}</h1>
          <h2>Which property do you want to work with today</h2>
          {renderProperties()}
        </div>
      </>
    </AdminLayout>
  );
};
