import { Injectable } from '@angular/core';
import { AdmbCompletionProvider } from "@metlife/admb-lang";

@Injectable({
  providedIn: 'root'
})
export class AdmbProviderService implements AdmbCompletionProvider {
  constructor() { 
  }

  listApps(): Promise<string[]> {
    return Promise.resolve(['11712_IIB', '10215_RADWM', '6525_DPA_WebService', '6664_eMetrics', '13399_Employee_Claims', '1750_MetDental', '7966_AEP', '1744_HWSI', '13399_Employee_Accounts', '7429_Brasil_Portais', '6537_SiteMinder', '13399_Employee_Portal', '2452_BOSS', '7351_TAM', '2942_IBSE', '7177_IVR', '8911_MetOnline', '8167_eDPM', '1748_MyBenefits', '11512_GSSP_API_PLATFORM_US', '7257_Profile_DB', '6525_DPAPortal', '12579_MFP_US', '1668_EZSP', '2936_CAS', '11658_EOS_US', '8058_ACE', '1081_CDFWS', '2940_eservice', '13399_Employee_FAP', '12075_MIS', '6664_GSM', '6558_FIV', '7184_WinWeb', '12947_USDLogin', '6908_CDH', '5251_MetiPAQS', '11857_GSP_Colombia', '1662_SOHLIFE', '6546_EXPUWDS', '6525_DPA', '1726_Hyatt_Enrollment', '5292_MLI_ICONTACT_SUITE', '7598_HRA', '6668_OEMS', '5253_6637_MetLinkEligibility_CES', '9365_iWall', '8070_QIB', '5142_TermFund', '6907_Illustrations_PolicyExtract', '7138_CDWS', '5651_ParagonGVUL', '8815_CPAM', '4400_SmartApp_Suite', '5089_MetLinkPortal', '7292_TrustedAuth', '13399_Employee_DocsForms', '5039_ComMyAcnt', '9365_rWall', '2303_DSS_Website', '5612_PMACS', '6546_iMPAQSWS', '1244_EFORMS', '5247_MetLinkSMILE', '8028_AMS_Warehouse', '6642_Eligibility_Svc', '5101_MetLinkForms', '6720_FTS', '5074_GPAYMetLnk', '13401_Employer_Claims', '6706_iCOMP', '10643_DMS', '1740_EmployeeDental', '7981_TAMWA', '1212_RAIDERS2', '8112_MetCheck', '1737_VRPS', '11166_PMACS2', '6794_IDS_Acord', '11705_AMS_Demand_Management_Tools', '8223_SHS_Reporting', '1306_GPAY', '6742_Dental_Enroll_Services', '1174_DQS', '8163_ESS', '11627_Responder', '8822_ERK', '5097_MetLinkAdmin', '11622_CALI', '1753_SOH', '7227_TRS', '11146_Retail_Messaging_Web', '7351_LISA', '5206_PrivacyPortal', '6978_CP_AURA', '5301_AML_OFAC', '2453_BSF', '11141_MXOPDMCL', '13401_Employer_Accounts', '7970_GPS'])
  }
  browseTree(app: string, path: string[]): Promise<string[]> {
    return Promise.resolve(['Overall Application Performance', 'Business Transaction Performance', 'Information Points', 'Application Infrastructure Performance', 'Errors', 'End User Experience', 'Mobile', 'Backends', 'Service Endpoints'])
  }
}
