from rest_framework import serializers
from .models import SolarPackage, SolarPackageItem


class SolarPackageItemSerializer(serializers.ModelSerializer):
    productId = serializers.CharField(source='raw_product_id', read_only=True)
    productName = serializers.CharField(source='product_name', read_only=True)
    specsSummary = serializers.CharField(source='specs_summary', read_only=True)

    class Meta:
        model = SolarPackageItem
        fields = [
            'id',
            'productId',
            'productName',
            'quantity',
            'category',
            'specsSummary',
        ]


class SolarPackageSerializer(serializers.ModelSerializer):
    legacyId = serializers.CharField(source='legacy_id', read_only=True)
    items = SolarPackageItemSerializer(source='package_items', many=True, read_only=True)
    systemType = serializers.CharField(source='system_type', read_only=True)
    dailyGenerationEstimateKwh = serializers.FloatField(source='daily_generation_estimate_kwh', read_only=True)
    price = serializers.FloatField()
    originalPrice = serializers.FloatField(source='original_price', allow_null=True, read_only=True)
    savingsMonthlyEstimateBdt = serializers.FloatField(source='savings_monthly_estimate_bdt', read_only=True)
    warrantySummary = serializers.CharField(source='warranty_summary', read_only=True)
    idealFor = serializers.CharField(source='ideal_for', read_only=True)
    installationIncluded = serializers.BooleanField(source='installation_included', read_only=True)
    netMeteringEligible = serializers.BooleanField(source='net_metering_eligible', read_only=True)

    class Meta:
        model = SolarPackage
        fields = [
            'id',
            'legacyId',
            'legacy_id',
            'title',
            'slug',
            'tagline',
            'system_type',
            'systemType',
            'daily_generation_estimate_kwh',
            'dailyGenerationEstimateKwh',
            'price',
            'original_price',
            'originalPrice',
            'savings_monthly_estimate_bdt',
            'savingsMonthlyEstimateBdt',
            'warranty_summary',
            'warrantySummary',
            'ideal_for',
            'idealFor',
            'image',
            'features',
            'specifications',
            'installation_included',
            'installationIncluded',
            'net_metering_eligible',
            'netMeteringEligible',
            'items',
            'created_at',
            'updated_at',
        ]
