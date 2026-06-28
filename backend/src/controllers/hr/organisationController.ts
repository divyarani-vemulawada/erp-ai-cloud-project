import { Request, Response } from "express";
import { getOrganisationHierarchy } from "../../services/hr/organisationService";

export const getOrganisation = async (req: Request, res: Response) => {
  try {
    const departments = await getOrganisationHierarchy();
    res.status(200).json({ departments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch organisation hierarchy" });
  }
};
