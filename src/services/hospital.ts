/**
 * Represents essential information about a hospital.
 */
export interface Hospital {
  /**
   * The unique identifier for the hospital.
   */
hospitalId: string;
  /**
   * The name of the hospital.
   */
  name: string;
}

/**
 * Asynchronously retrieves a hospital by its unique ID.
 *
 * @param hospitalId The unique identifier of the hospital to retrieve.
 * @returns A promise that resolves to a Hospital object if found, or null if not found.
 */
export async function getHospital(hospitalId: string): Promise<Hospital | null> {
  // TODO: Implement this by calling an API.

  return {
    hospitalId: '123',
    name: 'General Hospital',
  };
}
