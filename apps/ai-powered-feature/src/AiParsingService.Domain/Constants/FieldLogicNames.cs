namespace AiParsingService.Domain.Constants;

public static class FieldLogicNames
{
    // Sample Test
    public const string OrderNumber = "ordernumber";
    public const string SampleTestId = "sampletestid";
    public const string ReceiptDate = "receiptdate";
    public const string ResultsReadyDate = "resultsreadydate";
    public const string Results = "results";

    // Sample
    public const string SampleNumber = "samplenumber";
    public const string CustomerReference = "customerreference";
    public const string CollectedDate = "collecteddate";
    public const string HarvestedDate = "harverstdate";
    public const string SampleDate = "sampledate";
    public const string IsCalibration = "iscalibration";
    public const string SampleDetails = "sampledetails";
    public const string Comment = "comment";

    // Product
    public const string ProductCode = "productcode";
    public const string ProductName = "productname";

    // Supplier
    public const string SupplierName = "suppliername";
    public const string SupplierCode = "suppliercode";

    // Account
    public const string AccountCode = "accountcode";
    public const string AccountName = "accountname";

    // Tenant
    public const string TenantCode = "tenantcode";
    public const string TenantName = "tenantname";

    // Production Lines and Devices
    public const string DeviceName = "devicename";
    public const string DeviceCode = "devicecode";

    public static IReadOnlyCollection<string> All = new HashSet<string>
    {
        SampleTestId, ReceiptDate, OrderNumber, CustomerReference,
        CollectedDate, HarvestedDate, ProductCode, ProductName,
        SupplierName, SupplierCode, AccountCode, AccountName,
        TenantCode, TenantName, DeviceName, DeviceCode,
        SampleNumber, ResultsReadyDate, Results, SampleDate,
        IsCalibration, SampleDetails, Comment
    };
}
