import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  TextField,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import React from "react";
import { BasicInfoModel } from "../../interfaces";

interface BasicInfoProps {
  basicInfo: BasicInfoModel;
  setBasicInfo: React.Dispatch<React.SetStateAction<BasicInfoModel>>;
  onBasicInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked: (role: string) => boolean;
  hidden?: boolean
}

export const BasicInfo: React.FC<BasicInfoProps> = ({
  basicInfo,
  isChecked,
  onBasicInfoChange,
  setBasicInfo,
  hidden,
}) => {
  return (
    <div hidden={hidden}>
        <h1>Basic Info</h1>
        <p>
          Provide the required client information and assign existing roles for
          access management
        </p>
        <Divider />
        <TextField
          id="clientId"
          label="Client ID"
          placeholder="Enter client ID"
          onChange={onBasicInfoChange}
          value={basicInfo.clientID}
        />
        <TextField
          id="clientName"
          label="Client Name"
          placeholder="Enter client name"
          value={basicInfo.clientName}
          onChange={onBasicInfoChange}
        />
        <h2>Assign Existing Roles</h2>
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                id="fhir"
                checked={isChecked("fhir")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setBasicInfo({
                      ...basicInfo,
                      roles: [...basicInfo.roles, e.target.id],
                    });
                  } else {
                    setBasicInfo({
                      ...basicInfo,
                      roles: basicInfo.roles.filter(
                        (role) => role !== e.target.id
                      ),
                    });
                  }
                }}
              />
            }
            label="fhir"
          />
        </FormControl>
        <Divider />
        <br />
        <Accordion square={false}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            Options Details
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              id="organization"
              label="Organization"
              value={basicInfo.organization}
              onChange={onBasicInfoChange}
            />
            <TextField
              fullWidth
              id="softwareName"
              label="Software Name"
              value={basicInfo.softwareName}
              onChange={onBasicInfoChange}
            />
            <TextField
              fullWidth
              id="description"
              label="Description"
              value={basicInfo.description}
              onChange={onBasicInfoChange}
            />
            <TextField
              fullWidth
              id="location"
              label="Location"
              value={basicInfo.location}
              onChange={onBasicInfoChange}
            />
            <TextField
              id="contactPerson"
              label="Contact Person"
              value={basicInfo.contactPerson}
              onChange={onBasicInfoChange}
            />
            <TextField
              id="contactPersonEmail"
              label="Contact Person Email"
              value={basicInfo.contactPersonEmail}
              onChange={onBasicInfoChange}
            />
          </AccordionDetails>
        </Accordion>
    </div>
  );
};
