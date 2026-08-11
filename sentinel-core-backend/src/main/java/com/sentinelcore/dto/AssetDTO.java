package	com.sentinelcore.dto;
import	lombok.*;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetDTO
{
    private	Long id;
    private	String	assetName;
    private	String	assetType;
    private	String ipAddress;
    private	Double cpuUsage;
    private Double memoryUsage;
    private	Double diskUsage;
    private	Double networkUsage;
    private String status;
}